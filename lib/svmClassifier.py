"""
SVM-based 9-Box Talent Classification Model
Uses scikit-learn for talent assessment
"""

import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import json

class TalentClassifier:
    """
    9-Box Grid Talent Classifier using SVM
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize and train the SVM model with sample data"""
        # Sample training data (features: education_level, experience, grade, skills_count)
        # Labels: 0-8 representing 9-box positions (0=bottom-left, 8=top-right)
        X_train = np.array([
            [1, 2, 1, 3],   # Low performance, Low potential -> 0 (Underperformer)
            [1, 3, 1, 4],   # Low performance, Med potential -> 1 (Risk)
            [1, 4, 2, 5],   # Low performance, High potential -> 2 (Enigma)
            [2, 3, 2, 4],   # Med performance, Low potential -> 3 (Inconsistent)
            [2, 4, 2, 5],   # Med performance, Med potential -> 4 (Core Player)
            [2, 5, 3, 6],   # Med performance, High potential -> 5 (High Potential)
            [3, 4, 3, 5],   # High performance, Low potential -> 6 (Solid Professional)
            [3, 5, 3, 6],   # High performance, Med potential -> 7 (High Performer)
            [3, 6, 4, 7],   # High performance, High potential -> 8 (Star/Top Talent)
        ])
        
        y_train = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8])
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train SVM model
        self.model = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
        self.model.fit(X_train_scaled, y_train)
    
    def _extract_features(self, employee_data):
        """Extract numerical features from employee data"""
        # Education level mapping
        education_map = {
            'S3': 4, 'S2': 3, 'S1': 2, 'D4': 2, 'D3': 1, 'SMA': 1
        }
        education = employee_data.get('education', 'S1')
        education_level = education_map.get(education, 2)
        
        # Work experience
        experience = int(employee_data.get('workExperience', 0))
        
        # Grade level mapping
        grade = employee_data.get('grade', 'III/c')
        grade_value = self._parse_grade(grade)
        
        # Skills count
        skills = employee_data.get('skills', [])
        skills_count = len(skills) if skills else 3
        
        return np.array([[education_level, experience, grade_value, skills_count]])
    
    def _parse_grade(self, grade_str):
        """Parse Indonesian civil service grade to numerical value"""
        try:
            # Format: "I/a" to "IV/e"
            if '/' in grade_str:
                roman, letter = grade_str.split('/')
                roman_map = {'I': 1, 'II': 2, 'III': 3, 'IV': 4}
                letter_map = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
                
                roman_val = roman_map.get(roman.strip(), 3)
                letter_val = letter_map.get(letter.strip().lower(), 3)
                
                return roman_val + (letter_val * 0.2)  # e.g., III/c = 3.6
            return 3  # default
        except:
            return 3
    
    def _box_number_to_info(self, box_num):
        """Convert box number (0-8) to 9-box grid information"""
        box_names = [
            "Underperformer",           # 0: Low-Low
            "Risk",                     # 1: Low-Med
            "Enigma",                   # 2: Low-High
            "Inconsistent",             # 3: Med-Low
            "Core Player",              # 4: Med-Med
            "High Potential",           # 5: Med-High
            "Solid Professional",       # 6: High-Low
            "High Performer",           # 7: High-Med
            "Star/Top Talent"           # 8: High-High
        ]
        
        # Map to performance and potential
        performance_map = {
            0: {"level": "Low", "score": 1},
            1: {"level": "Low", "score": 1},
            2: {"level": "Low", "score": 1},
            3: {"level": "Medium", "score": 2},
            4: {"level": "Medium", "score": 2},
            5: {"level": "Medium", "score": 2},
            6: {"level": "High", "score": 3},
            7: {"level": "High", "score": 3},
            8: {"level": "High", "score": 3}
        }
        
        potential_map = {
            0: {"level": "Low", "score": 1},
            1: {"level": "Medium", "score": 2},
            2: {"level": "High", "score": 3},
            3: {"level": "Low", "score": 1},
            4: {"level": "Medium", "score": 2},
            5: {"level": "High", "score": 3},
            6: {"level": "Low", "score": 1},
            7: {"level": "Medium", "score": 2},
            8: {"level": "High", "score": 3}
        }
        
        priority_map = {
            0: "Low Priority",
            1: "Low Priority",
            2: "Watch",
            3: "Moderate",
            4: "Core",
            5: "High Priority",
            6: "Retain",
            7: "High Priority",
            8: "Critical Talent"
        }
        
        return {
            "talentBox": box_names[box_num],
            "boxNumber": box_num + 1,
            "performance": performance_map[box_num],
            "potential": potential_map[box_num],
            "priority": priority_map[box_num]
        }
    
    def classify(self, employee_data):
        """
        Classify employee into 9-box grid
        
        Args:
            employee_data (dict): Employee information
            
        Returns:
            dict: Classification result with performance, potential, and box info
        """
        try:
            # Extract features
            features = self._extract_features(employee_data)
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Predict box number
            box_num = self.model.predict(features_scaled)[0]
            
            # Get box information
            result = self._box_number_to_info(int(box_num))
            
            # Add justifications
            result["performance"]["justification"] = self._generate_performance_justification(
                employee_data, result["performance"]["level"]
            )
            result["potential"]["justification"] = self._generate_potential_justification(
                employee_data, result["potential"]["level"]
            )
            
            return result
        except Exception as e:
            print(f"Error in classification: {e}")
            # Return default mid-range classification
            return self._box_number_to_info(4)  # Core Player
    
    def _generate_performance_justification(self, data, level):
        """Generate performance justification text"""
        grade = data.get('grade', 'III/c')
        experience = data.get('workExperience', 0)
        
        if level == "High":
            return f"Menunjukkan kinerja tinggi dengan grade {grade} dan pengalaman {experience} tahun."
        elif level == "Medium":
            return f"Kinerja konsisten dengan grade {grade} dan pengalaman {experience} tahun."
        else:
            return f"Perlu peningkatan kinerja, grade {grade} dengan pengalaman {experience} tahun."
    
    def _generate_potential_justification(self, data, level):
        """Generate potential justification text"""
        education = data.get('education', 'S1')
        skills = data.get('skills', [])
        
        if level == "High":
            return f"Potensi tinggi dengan pendidikan {education} dan {len(skills)} kompetensi."
        elif level == "Medium":
            return f"Potensi berkembang dengan pendidikan {education} dan {len(skills)} kompetensi."
        else:
            return f"Memerlukan pengembangan lebih lanjut, pendidikan {education}."


# Flask API endpoint structure (for future implementation)
"""
Flask API Endpoint Design:

POST /api/classify
Request Body:
{
    "name": "John Doe",
    "position": "Analyst",
    "education": "S1",
    "workExperience": 5,
    "grade": "III/c",
    "skills": ["Python", "Data Analysis", "SQL"],
    "achievements": ["Award 1", "Award 2"]
}

Response:
{
    "success": true,
    "data": {
        "talentBox": "Core Player",
        "boxNumber": 5,
        "performance": {
            "level": "Medium",
            "score": 2,
            "justification": "..."
        },
        "potential": {
            "level": "Medium",
            "score": 2,
            "justification": "..."
        },
        "priority": "Core"
    }
}
"""

if __name__ == "__main__":
    # Test the classifier
    classifier = TalentClassifier()
    
    test_data = {
        "name": "Test Employee",
        "position": "Analyst",
        "education": "S1",
        "workExperience": 5,
        "grade": "III/c",
        "skills": ["Python", "Data Analysis", "SQL", "Machine Learning"],
        "achievements": ["Best Employee 2023"]
    }
    
    result = classifier.classify(test_data)
    print("Classification Result:")
    print(json.dumps(result, indent=2))
