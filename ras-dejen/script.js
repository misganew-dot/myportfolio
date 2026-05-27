document.getElementById('rasDejenForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. የHTML ሳጥኖቹን (Elements) ማግኘት
    var nameField = document.getElementById('visitorName');
    var cityField = document.getElementById('visitorFrom');
    var phoneField = document.getElementById('visitorPhone');
    var emailField = document.getElementById('visitorEmail');

    // የትኛውንም ሳጥን ብሮውዘሩ ካጣው ስህተት እንዳይፈጠር መከላከል
    if (!nameField || !cityField || !phoneField || !emailField) {
        alert("ስህተት፡ እባክህ በHTML ፎርምህ ላይ ያሉት IDs visitorName, visitorFrom, visitorPhone, እና visitorEmail መሆናቸውን አረጋግጥ!");
        return false;
    }

    // 2. በሳጥኖቹ ውስጥ የተጻፉትን ፅሁፎች ማግኘት
    var name = nameField.value.trim();
    var city = cityField.value.trim();
    var phone = phoneField.value.trim();
    var email = emailField.value.trim();

    // ለእያንዳንዱ ሳጥን መጀመሪያ የቆየውን ስህተት ማጽዳት
    nameField.setCustomValidity('');
    cityField.setCustomValidity('');
    phoneField.setCustomValidity('');
    emailField.setCustomValidity('');

    // --- 1. የሙሉ ስም ማረጋገጫ (አማርኛ እና እንግሊዘኛ - የስምና አባት ስም ጥምረት) ---
    // ይህ ህግ ቢያንስ ሁለት ቃላት (ስም እና የአባት ስም) በመሃል በአንድ ባዶ ቦታ (Space) መለየታቸውን ያረጋግጣል
    var nameRegex = /^[a-zA-Z\u1200-\u137F]{2,15}(?:\s[a-zA-Z\u1200-\u137F]{2,15})+$/;
    if (!nameRegex.test(name)) {
        nameField.setCustomValidity('please enter full name (የአባት ስምን ጨምሮ በአማርኛ ወይም በእንግሊዘኛ)');
        nameField.reportValidity();
        return false;
    }

    // --- 2. የሀገር/ከተማ ማረጋገጫ ---
    // ከተማው ዝም ብሎ የተረጨ ፊደል እንዳይሆን ቢያንስ 3 ፊደል እና ትክክለኛ ቃላት መሆናቸውን ያረጋግጣል
    if (city.length < 3 || !/^[a-zA-Z\s\u1200-\u137F]+$/.test(city)) {
        cityField.setCustomValidity('እባክዎን የመጡበትን ሀገር/ከተማ በትክክል ያስገቡ');
        cityField.reportValidity();
        return false;
    }

    // --- 3. የስልክ ቁጥር ማረጋገጫ (09, 07, +251 ወይም የውጭ ሀገር) ---
    var cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    var mobilePattern = /^(09|07|\+2519|\+2517|\+[0-9]{1,4})[0-9]{7,12}$/;
    
    if (!mobilePattern.test(cleanPhone)) {
        phoneField.setCustomValidity('እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ');
        phoneField.reportValidity();
        return false;
    }

    // --- 4. የኢሜይል ማረጋገጫ (mih@r የሚሉትን በጥብቅ ይከለክላል፣ ከ@ በፊት ቢያንስ 3 ፊደል የግድ ይላል) ---
    var emailPattern = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        emailField.setCustomValidity('እባክዎን ትክክለኛ የኢሜይል አድራሻ ያስገቡ (ምሳሌ፡ name@gmail.com)');
        emailField.reportValidity();
        return false;
    }

    // --- ሁሉም መረጃ ትክክል ከሆነ የሚፈጸም ተግባር ---

    // 1. የምዝገባ ቦታውን ደብቆ የታሪክ ገጹን ማሳየት
    var regArea = document.getElementById('registrationArea');
    var mountainContent = document.getElementById('mountainContent');
    if (regArea) regArea.style.display = 'none';
    if (mountainContent) mountainContent.style.display = 'block';

    // 2. ባነር ስር ያለውን መረጃ መተካት
    var msgHtml = `<i class="fas fa-check-circle"></i> ሰላም <strong>${name}</strong>! መረጃዎን ወደ <strong>${email}</strong> ልከናል። ከ <strong>${city}</strong> መጥተው ራስ ደጀንን ስለጎበኙ እናመሰግናለን።`;
    
    var greenBanners = document.querySelectorAll('div[style*="background: #c8e6c9"]');
    if (greenBanners.length > 0) {
        greenBanners[0].innerHTML = msgHtml;
    } else {
        var welcomeBanner = document.getElementById('welcomeBanner');
        if (welcomeBanner) welcomeBanner.innerHTML = msgHtml;
    }

    // 3. የጀርባ ቀለሙን ማስተካከልና ፔጁን ወደ ላይ ከፍ ማድረግ
    document.body.style.backgroundColor = "#f7f3eb";
    window.scrollTo(0, 0);
});

// ተጠቃሚው መፃፍ ሲጀምር ቀዩ ስህተት ወዲያው እንዲጠፋ ማድረጊያ
['visitorName', 'visitorFrom', 'visitorPhone', 'visitorEmail'].forEach(function(id) {
    var element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    }
});

function logout() {
    if(confirm("በእርግጥ መውጣት ይፈልጋሉ?")) {
        location.reload();
    }
}
// ተጠቃሚው በስልክ ሳጥኑ ላይ ከቁጥር፣ + እና - ውጪ እንዳይጽፍ መከልከል
document.getElementById('visitorPhone').addEventListener('keypress', function(e) {
    // የሚፈቀዱ ቁምፊዎች፡ 0-9፣ + እና - ብቻ ናቸው
    if (!/[0-9+\-\s]/.test(e.key)) {
        e.preventDefault(); // ከነዚህ ውጪ የተጫነውን ፊደል አይቀበለውም
    }
});