(function () {
    // Create a style element for your styles
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

    .dual-button {
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 10px;
        display: flex;
        overflow: hidden;
    }

    .left-button {
        text-decoration: none;
        font-family: 'Montserrat', sans-serif;
        cursor: pointer;
        display: flex;
        gap: 5px;
        background-color: #F4E7D4;
        color: #0C0C0C;
        align-items: center;
        justify-content: center;
        font-style: normal;
        font-weight: 500;
        flex: 1;
        padding: 0;
    }

    .left-button:hover {
        box-shadow: inset 0 0 0 150px rgba(12, 12, 12, 0.1);
    }

    .right-button {
        font-family: 'Montserrat', sans-serif;
        cursor: pointer;
        display: flex;
        gap: 5px;
        background-color: #0C0C0C;
        color: #F4E7D4;
        border: none;
        align-items: center;
        justify-content: center;
        font-style: normal;
        font-weight: 500;
        flex: 1;
        padding: 0;
    }

    .right-button:hover {
        box-shadow: inset 0 0 0 150px rgba(244, 231, 212, 0.1);
    }

    .continue-button {
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 10px;
        background-color: #0C0C0C;
        color: #F4E7D4;
        cursor: pointer;
        font-family: 'Montserrat', sans-serif;
        font-style: normal;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        text-decoration: none;
        overflow: hidden;
    }

    .continue-button:hover {
        box-shadow: inset 0 0 0 150px rgba(244, 231, 212, 0.15);
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);


    window.createSIDButton = function (isConnected, width, height, fontScale, onDisconnect, href) {
        let buttonWidth = width + "px";
        let buttonHeight = height + "px";
        let svgSize = 25 * fontScale;
        const manageURL = "https://me.sid.ai/";

        let container = document.getElementById('button-container');
        container.innerHTML = ''; // clear the container

        let sidSvg = document.getElementById('sid-svg').cloneNode(true);
        sidSvg.setAttribute("width", svgSize);
        sidSvg.setAttribute("height", svgSize);

        if (isConnected) {
            let dualButtonWrapper = document.createElement('div');
            dualButtonWrapper.className = "dual-button";
            dualButtonWrapper.style.width = buttonWidth;
            dualButtonWrapper.style.height = buttonHeight;
            container.appendChild(dualButtonWrapper);
            let leftButton = document.createElement('a');
            leftButton.className = "left-button";
            leftButton.href = manageURL;
            leftButton.target = "_blank";
            leftButton.textContent = "Manage";
            leftButton.style.width = buttonWidth;
            leftButton.style.height = buttonHeight;
            let leftSvg = sidSvg.cloneNode(true);
            leftSvg.querySelector('#sid-path').setAttribute("fill", "#0C0C0C");
            leftButton.appendChild(leftSvg);

            let rightButton = document.createElement('button');
            rightButton.textContent = "Disconnect";
            rightButton.className = "right-button";
            rightButton.style.width = buttonWidth;
            rightButton.style.height = buttonHeight;
            rightButton.onclick = function () {
                onDisconnect();
                console.log('Disconnect button clicked');
            };
            let rightSvg = sidSvg.cloneNode(true);
            rightSvg.querySelector('#sid-path').setAttribute("fill", "#F4E7D4");
            rightButton.appendChild(rightSvg);

            dualButtonWrapper.appendChild(leftButton);
            dualButtonWrapper.appendChild(rightButton);

        } else {
            let singleButton = document.createElement('a');
            singleButton.className = "continue-button";
            singleButton.href = href;
            singleButton.target = "_self";
            singleButton.textContent = "Continue with";
            singleButton.style.width = buttonWidth;
            singleButton.style.height = buttonHeight;
            let singleSvg = sidSvg.cloneNode(true);
            singleSvg.querySelector('#sid-path').setAttribute("fill", "#F4E7D4");
            singleButton.appendChild(singleSvg);

            container.appendChild(singleButton);
        }
    }

    createButton(false, 250, 40, 1, onDisconnect, "");
})();