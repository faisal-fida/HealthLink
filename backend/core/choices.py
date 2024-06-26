ADMIN = "admin"
DOCTOR = "doctor"
PATIENT = "patient"

ROLE_CHOICES = [
    (ADMIN, "Admin"),
    (DOCTOR, "Doctor"),
    (PATIENT, "Patient"),
]

SPECIALIZATION_CHOICES = [
    ("general_practice", "General Practice"),
    ("child_care", "Child Care"),
    ("women_health", "Women Health"),
    ("bone_joint_care", "Bone & Joint Care"),
    ("heart_care", "Heart Care"),
    ("skin_care", "Skin Care"),
    ("eye_care", "Eye Care"),
    ("dental_care", "Dental Care"),
    ("mental_health", "Mental Health"),
    ("brain_nervous_system_care", "Brain & Nervous System Care"),
    ("digestive_health", "Digestive Health"),
    ("urinary_tract_health", "Urinary Tract Health"),
    ("cancer_care", "Cancer Care"),
    ("ear_nose_throat_care", "Ear, Nose & Throat Care"),
    ("hormone_health", "Hormone Health"),
    ("joint_health", "Joint Health"),
    ("allergy_immune_system_care", "Allergy & Immune System Care"),
    ("lung_respiratory_health", "Lung & Respiratory Health"),
    ("kidney_health", "Kidney Health"),
    ("physical_therapy", "Physical Therapy"),
]

QUALIFICATION_CHOICES = [
    ("mbbs", "MBBS"),
    ("bds", "BDS"),
    ("md", "MD"),
]


APPOINTMENT_STATUS_CHOICES = [
    ("pending", "Pending"),
    ("confirmed", "Confirmed"),
    ("scheduled", "Scheduled"),
    ("canceled", "Canceled"),
    ("completed", "Completed"),
]

PAYMENT_CHOICES = [
    ("pending", "Pending"),
    ("paid", "Paid"),
]


DAY_CHOICES = [
    ("monday", "Monday"),
    ("tuesday", "Tuesday"),
    ("wednesday", "Wednesday"),
    ("thursday", "Thursday"),
    ("friday", "Friday"),
    ("saturday", "Saturday"),
    ("sunday", "Sunday"),
]
