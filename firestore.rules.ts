
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // FUNCIONES HELPER
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isTeacher() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/teachers_register/$(request.auth.uid));
    }
    
    function isStudent() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/form_students-register/$(request.auth.uid));
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidTimestamp(timestamp) {
      return timestamp <= request.time;
    }
    
    // TEACHERS
    match /teachers_register/{teacherId} {
      allow read: if isOwner(teacherId) || isTeacher();
      allow create: if !isAuthenticated() && 
                       request.resource.data.role == 'profesor';
      allow update: if isOwner(teacherId) && 
                       resource.data.updateCount < 7;
      allow delete: if false;
    }
    
    // STUDENTS
    match /form_students-register/{studentId} {
      allow read: if isOwner(studentId) || isTeacher();
      allow create: if !isAuthenticated() && 
                       request.resource.data.role == 'alumno' &&
                       request.resource.data.email.matches('.*@alumno\\.uaemex\\.mx$');
      allow update: if isOwner(studentId) && 
                       resource.data.updateCount < 5;
      allow delete: if false;
    }
    
    // MATERIALS
    match /materials_loaded/{materialId} {
      allow read: if isAuthenticated();
      allow create: if isStudent() && 
                       request.resource.data.autorId == request.auth.uid &&
                       request.resource.data.estado == 'pendiente';
      allow update: if (isStudent() && 
                        resource.data.autorId == request.auth.uid && 
                        resource.data.estado == 'pendiente') ||
                       isTeacher();
      allow delete: if isTeacher() || 
                       (isStudent() && resource.data.autorId == request.auth.uid);
    }
    
    // NOTIFICATIONS FOR TEACHERS
    match /notificationsProfessor/{notificationId} {
      allow read: if isTeacher() && 
                     resource.data.profesorId == request.auth.uid;
      allow create: if isStudent() && 
                       request.resource.data.alumnoId == request.auth.uid;
      allow update: if isTeacher() && 
                       resource.data.profesorId == request.auth.uid;
      allow delete: if isTeacher() && 
                       resource.data.profesorId == request.auth.uid;
    }
    
    // NOTIFICATIONS FOR STUDENTS
    match /notifications/{notificationId} {
      allow read: if isStudent() && 
                     resource.data.alumnoId == request.auth.uid;
      allow create: if isTeacher();
      allow update: if isStudent() && 
                       resource.data.alumnoId == request.auth.uid;
      allow delete: if isStudent() && 
                       resource.data.alumnoId == request.auth.uid;
    }
    
    // COMMENTS
    match /profesor_comentarios/{commentId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // DENY ALL BY DEFAULT
    match /{document=**} {
      allow read, write: if false;
    }
  }
}