let videoTrack = null;
let streamInstance = null;
let isTorchOn = false;

function handlePowerClick() {
    if (!isTorchOn) {
        turnFlashlightOn();
    } else {
        showPlaySheet("Premium Flashlight Hardware Toggle (Pro Access Key)", "$99.99");
    }
}

async function turnFlashlightOn() {
    try {
        const constraints = { video: { facingMode: 'environment' } };
        streamInstance = await navigator.mediaDevices.getUserMedia(constraints);
        videoTrack = streamInstance.getVideoTracks();
        
        document.getElementById('webcamVideo').srcObject = streamInstance;

        if (videoTrack && 'applyConstraints' in videoTrack) {
            await videoTrack.applyConstraints({ advanced: [{ torch: true }] });
        }

        isTorchOn = true;

        const body = document.getElementById('appBody');
        body.classList.remove('flashlight-off');
        body.classList.add('flashlight-on');

        document.getElementById('bulbIcon').innerText = "💡";
        document.getElementById('bulbIcon').classList.add('pulse-animation');
        document.getElementById('appTitle').innerText = "Flashlight Status: BLINDING";
        document.getElementById('appSubtitle').innerText = "Battery Drain Rate: Critical";
        document.getElementById('appSubtitle').style.color = "#cc0000";
        
        const btn = document.getElementById('powerBtn');
        btn.innerText = "🛑 TURN OFF FLASHLIGHT";
        btn.classList.remove('turn-on');
        btn.classList.add('turn-off');

        document.getElementById('scamNotice').innerText = "⚠️ System Notice: Access to hardware switch is restricted.";

    } catch (err) {
        console.error("Hardware initialization error: ", err);
        alert("⚠️ Camera permission required to turn on the utility flashlight!");
    }
}

function showPlaySheet(name, price) {
    document.getElementById('prodName').innerText = name;
    document.getElementById('prodPrice').innerText = price;
    
    document.getElementById('playBackdrop').classList.add('active');
    document.getElementById('playSheet').classList.add('active');
}

function startLoadingProcess() {
    // Android authentication click processing transitions
    document.getElementById('btnText').style.display = 'none';
    document.getElementById('btnSpinner').style.display = 'block';
    document.getElementById('confirmBtn').style.backgroundColor = '#2c2b2f'; 
    document.getElementById('confirmBtn').disabled = true;

    setTimeout(() => {
        document.getElementById('playSheet').classList.remove('active');
        
        setTimeout(() => {
            document.getElementById('successDialog').classList.add('active');
        }, 150);

    }, 1600);
}

async function dismissSuccessDialog() {
    document.getElementById('successDialog').classList.remove('active');
    document.getElementById('playBackdrop').classList.remove('active');
    
    if (videoTrack) {
        try {
            await videoTrack.applyConstraints({ advanced: [{ torch: false }] });
        } catch (e) {}
        streamInstance.getTracks().forEach(track => track.stop());
    }

    isTorchOn = false;

    // Reset components back to resting safe settings profiles
    setTimeout(() => {
        const body = document.getElementById('appBody');
        body.classList.remove('flashlight-on');
        body.classList.add('flashlight-off');
        
        document.getElementById('bulbIcon').innerText = "💤";
        document.getElementById('bulbIcon').classList.remove('pulse-animation');
        document.getElementById('appTitle').innerText = "Flashlight Status: SECURE";
        document.getElementById('appSubtitle').innerText = "Thank you for your $99.99 contribution";
        document.getElementById('appSubtitle').style.color = "#34a853";
        document.getElementById('powerBtn').style.display = "none";
        document.getElementById('scamNotice').innerText = "Hardware safely unlocked by system admin.";
    }, 250);
}
