# Just Thank You

Simple auth & storage implementation using Firebase(authentication cloud functions, storage, real-time database).

### API specification

* sign-up
    
    Function URL (signUp): https://us-central1-just-thank-you-cfc70.cloudfunctions.net/signUp
    
    supported method: [POST]
    
    payload
    
        {
          "username" : "test",
          "image" : "1243@example.com",
          "firstName" : "test",
          "lastName" : "test",
          "profileUrl" : "http://test.com/image"
        }    


* upload-profile-image
    
    Function URL (uploadProfile): https://us-central1-just-thank-you-cfc70.cloudfunctions.net/uploadProfile
    
    supported method: [POST]
        
    payload
    
        {
          "username" : "test1",
          "image" : "base64image"
        }