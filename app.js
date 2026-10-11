let localVideoTrack = null;
let activeMediaStream = null;
let isTorchOn = false;

function handlePowerClick() {
    if (!isTorchOn) {
        togglePhoneHardwareTorch(true);
    } else {
        showPlaySheet("Premium Flashlight Hardware System Key Access", "$99.99");
    }
}

// Fixed Hardware Hook: Requests back camera with standard track profiles
function togglePhoneHardwareTorch(turnOn) {
    if (turnOn) {
        const constraints = { 
            video: { 
                facingMode: { ideal: "environment" } 
            } 
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                activeMediaStream = stream;
                const videoElement = document.getElementById('dummyVideo');
                videoElement.srcObject = stream;

                // Grab video track lines
                const tracks = stream.getVideoTracks();
                if (tracks.length === 0) throw new Error("No tracks found");
                localVideoTrack = tracks[0];

                // Fire torch constraints
                return localVideoTrack.applyConstraints({
                    advanced: [{ torch: true }]
                });
            })
            .then(function() {
                isTorchOn = true;
                updateUIPanels(true);
            })
            .catch(function(err) {
                console.error("Torch error:", err);
                alert("⚠️ Flashlight hardware error. Make sure your browser camera permission is allowed and no other app is using the camera!");
            });
    } else {
        // Shutdown sequence
        if (localVideoTrack) {
            localVideoTrack.applyConstraints({ advanced: [{ torch: false }] })
                .catch(e => console.log(e));
        }
        if (activeMediaStream) {
            activeMediaStream.getTracks().forEach(track => track.stop());
        }
        isTorchOn = false;
        updateUIPanels(false);
    }
}

function updateUIPanels(lightActive) {
    const body = document.getElementById('appBody');
    const btn = document.getElementById('powerBtn');
    
    if (lightActive) {
        body.className = "flashlight-on";
        document.getElementById('bulbIcon').innerText = "💡";
        document.getElementById('bulbIcon').classList.add('pulse-animation');
        document.getElementById('appTitle').innerText = "Flashlight Status: BLINDING";
        document.getElementById('appSubtitle').innerText = "Battery Drain Rate: Critical";
        document.getElementById('appSubtitle').style.color = "#cc0000";
        
        btn.innerText = "🛑 TURN OFF FLASHLIGHT";
        btn.className = "power-btn turn-off";
        document.getElementById('scamNotice').innerText = "⚠️ System Notice: Access to hardware switch is restricted.";
    } else {
        body.className = "flashlight-off";
        document.getElementById('bulbIcon').innerText = "💤";
        document.getElementById('bulbIcon').classList.remove('pulse-animation');
        document.getElementById('appTitle').innerText = "Flashlight Status: SECURE";
        document.getElementById('appSubtitle').innerText = "Thank you for your $99.99 contribution";
        document.getElementById('appSubtitle').style.color = "#34a853";
        btn.style.display = "none";
        document.getElementById('scamNotice').innerText = "Hardware safely unlocked by system admin.";
    }
}

function showPlaySheet(name, price) {
    document.getElementById('prodName').innerText = name;
    document.getElementById('prodPrice').innerText = price;
    document.getElementById('playBackdrop').classList.add('active');
    document.getElementById('playSheet').classList.add('active');
}

function startLoadingProcess() {
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

function dismissSuccessDialog() {
    document.getElementById('successDialog').classList.remove('active');
    document.getElementById('playBackdrop').classList.remove('active');
    
    // Shut down the real physical phone bulb
    togglePhoneHardwareTorch(false);
}
