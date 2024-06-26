import os
import cv2
import numpy as np
from typing import Tuple


class EmotionPredictor:
    SIZE: int = 48
    OBJECTS: Tuple[str, ...] = (
        "angry",
        "disgust",
        "fear",
        "happy",
        "sad",
        "surprise",
        "neutral",
    )
    model_path: str = os.path.join(os.path.dirname(__file__), "model.tflite")
    face_path: str = os.path.join(os.path.dirname(__file__), "face.xml")

    def __init__(self):
        self._model = None
        self._face_cascade = None
        self._load_cascade()

    def _load_model(self):
        if self._model is None:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError("Model file not found")
            try:
                import tflite_runtime.interpreter as tflite
            except ImportError:
                raise ImportError("Tensorflow Lite not installed")
            self._model = tflite.Interpreter(self.model_path, [])
            self._model.allocate_tensors()

    def _load_cascade(self):
        if self._face_cascade is None:
            if not os.path.exists(self.face_path):
                raise FileNotFoundError("Face cascade file not found")
            self._face_cascade = cv2.CascadeClassifier(self.face_path)

    def detect_single_face(self, image: bytes) -> np.ndarray:
        image = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self._face_cascade.detectMultiScale(
            image, 1.3, 5, minSize=(self.SIZE, self.SIZE)
        )
        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            face_image = image[y : y + h, x : x + w]
            return face_image
        raise ValueError("No face detected in the image")

    def preprocessing(self, face_image: np.ndarray) -> np.ndarray:
        x = cv2.resize(face_image, (self.SIZE, self.SIZE))
        x = x.reshape(x.shape + (1,))
        x = np.array(x, dtype="float32")
        x = np.expand_dims(x, axis=0)
        if x.max() > 1:
            x = x / 255.0
            return x
        raise ValueError("Invalid image, unable to preprocess")

    def predict(self, image: bytes) -> str:
        self._load_model()
        face_image = self.detect_single_face(image)
        preprocessed = self.preprocessing(face_image)
        input_details = self._model.get_input_details()
        output_details = self._model.get_output_details()
        self._model.set_tensor(input_details[0]["index"], preprocessed)
        self._model.invoke()
        predictions = self._model.get_tensor(output_details[0]["index"])
        if isinstance(predictions, np.ndarray):
            return self.OBJECTS[np.argmax(predictions)]
        raise ValueError("Invalid prediction")
