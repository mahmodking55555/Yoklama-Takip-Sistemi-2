// Firebase yapılandırması
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Yeni hesap oluşturma fonksiyonu (Firestore'a kaydetme)
function createAccount(fullName, username, password, accountType) {
    const accountsRef = db.collection('accounts');
    accountsRef.add({
        fullName,
        username,
        password,
        accountType
    }).then(() => {
        alert('Hesap başarıyla oluşturuldu!');
    }).catch((error) => {
        alert('Hata: ' + error.message);
    });
}

// Giriş yapma fonksiyonu (Firebase Authentication)
function login(username, password) {
    const accountsRef = db.collection('accounts');
    accountsRef.where('username', '==', username).where('password', '==', password)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const account = querySnapshot.docs[0].data();
                localStorage.setItem('currentUser', JSON.stringify(account));
                // Hesap türüne göre yönlendirme
                if (account.accountType === "teacher") {
                    window.location.href = "teacher_dashboard.html";
                } else if (account.accountType === "student") {
                    window.location.href = "student_dashboard.html";
                }
            } else {
                alert('Kullanıcı adı veya şifre yanlış.');
            }
        }).catch((error) => {
            alert('Hata: ' + error.message);
        });
}

// Çıkış yapma fonksiyonu
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "index.html";
}

// Ders oluşturma fonksiyonu (Firestore'a kaydetme)
function createLecture(lectureName, lectureCode, lectureDate) {
    const lecturesRef = db.collection('lectures');
    lecturesRef.add({
        lectureName,
        lectureCode,
        lectureDate,
        attendees: []
    }).then(() => {
        alert('Ders başarıyla oluşturuldu!');
    }).catch((error) => {
        alert('Hata: ' + error.message);
    });
}

// Öğrenci yoklama kaydı fonksiyonu (Firestore'a kaydetme)
function registerAttendance(lectureCode) {
    const lecturesRef = db.collection('lectures');
    lecturesRef.where('lectureCode', '==', lectureCode)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const lectureDoc = querySnapshot.docs[0];
                const lecture = lectureDoc.data();
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));

                if (!lecture.attendees.includes(currentUser.fullName)) {
                    lecture.attendees.push(currentUser.fullName);
                    lectureDoc.ref.update({
                        attendees: lecture.attendees
                    }).then(() => {
                        alert('Yoklama başarıyla kaydedildi!');
                    }).catch((error) => {
                        alert('Hata: ' + error.message);
                    });
                } else {
                    alert('Bu ders için zaten kaydınız var.');
                }
            } else {
                alert('Geçersiz ders kodu.');
            }
        }).catch((error) => {
            alert('Hata: ' + error.message);
        });
}
