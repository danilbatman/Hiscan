import requests
import sys
import json
from datetime import datetime
import uuid

class MedAnalyzerAPITester:
    def __init__(self, base_url="https://c759e10b-89bf-4862-848d-1f7f50b13e55.preview.emergentagent.com"):
        self.base_url = base_url
        self.user_data = None
        self.analysis_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)

            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2, default=str)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error Response: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        user_data = {
            "name": "Test User",
            "email": test_email,
            "password": "password123",
            "age": 30,
            "gender": "male"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/register",
            200,
            data=user_data
        )
        
        if success and 'user_id' in response:
            self.user_data = {
                "user_id": response['user_id'],
                "email": test_email,
                "password": "password123",
                "name": "Test User"
            }
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        if not self.user_data:
            print("❌ No user data available for login test")
            return False
            
        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/login",
            200,
            data=login_data
        )
        
        if success and 'user' in response:
            self.user_data.update(response['user'])
            return True
        return False

    def test_medical_analysis(self):
        """Test medical analysis submission"""
        if not self.user_data:
            print("❌ No user data available for analysis test")
            return False
            
        # Test with form data (multipart/form-data)
        analysis_data = {
            "user_id": self.user_data["user_id"],
            "patient_name": "Иван Петров",
            "patient_age": "35",
            "patient_gender": "male",
            "analysis_type": "Анализ крови",
            "symptoms": "Усталость, головная боль",
            "medications": "Витамины"
        }
        
        success, response = self.run_test(
            "Medical Analysis Submission",
            "POST",
            "api/analyze",
            200,
            data=analysis_data
        )
        
        if success and 'analysis_id' in response:
            self.analysis_id = response['analysis_id']
            return True
        return False

    def test_get_analysis_details(self):
        """Test getting analysis details"""
        if not self.analysis_id:
            print("❌ No analysis ID available for details test")
            return False
            
        success, response = self.run_test(
            "Get Analysis Details",
            "GET",
            f"api/analysis/{self.analysis_id}",
            200
        )
        return success

    def test_get_user_analyses(self):
        """Test getting user analyses list"""
        if not self.user_data:
            print("❌ No user data available for analyses list test")
            return False
            
        success, response = self.run_test(
            "Get User Analyses",
            "GET",
            f"api/user/{self.user_data['user_id']}/analyses",
            200
        )
        return success

    def test_get_user_dashboard(self):
        """Test getting user dashboard"""
        if not self.user_data:
            print("❌ No user data available for dashboard test")
            return False
            
        success, response = self.run_test(
            "Get User Dashboard",
            "GET",
            f"api/user/{self.user_data['user_id']}/dashboard",
            200
        )
        return success

    def test_existing_user_login(self):
        """Test login with existing test user"""
        existing_user = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        success, response = self.run_test(
            "Existing User Login",
            "POST",
            "api/login",
            200,
            data=existing_user
        )
        
        if success and 'user' in response:
            print("✅ Existing test user login successful")
            return True, response['user']
        return False, None

def main():
    print("🚀 Starting MedAnalyzer API Testing...")
    print("=" * 60)
    
    tester = MedAnalyzerAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("User Registration", tester.test_user_registration),
        ("User Login", tester.test_user_login),
        ("Medical Analysis", tester.test_medical_analysis),
        ("Get Analysis Details", tester.test_get_analysis_details),
        ("Get User Analyses", tester.test_get_user_analyses),
        ("Get User Dashboard", tester.test_get_user_dashboard),
    ]
    
    # Run all tests
    for test_name, test_func in tests:
        try:
            result = test_func()
            if not result:
                print(f"⚠️  {test_name} failed, but continuing with other tests...")
        except Exception as e:
            print(f"❌ {test_name} threw exception: {str(e)}")
    
    # Test existing user login separately
    print(f"\n{'='*60}")
    print("🔍 Testing with existing test user...")
    success, existing_user = tester.test_existing_user_login()
    
    # Print final results
    print(f"\n{'='*60}")
    print("📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())