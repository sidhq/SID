import React, {useState} from 'react';

type ConnectSidButtonProps = {
    isConnected: boolean;
}
const ConnectSidButton: React.FC<ConnectSidButtonProps> = ({isConnected}) => {
    const urlWhenNotConnected = process.env.SID_CALLBACK_URL;
    const urlWhenConnected = "https://me.sid.ai/";

    const [isHovered, setIsHovered] = useState(false);
    const theme = isConnected ? "light" : "dark";
    const url = isConnected ? urlWhenConnected : urlWhenNotConnected;
    const target = isConnected ? "_self" : "_blank";
    const buttonText = isConnected ? "Open SID's Privacy Dashboard" : "Continue with SID";

    const styles = {
        loginButton: {
            display: "inline-block",
            alignItems: "center",
            width: "250px",
            height: "52px",
            padding: "0 8px 0 52px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "16px",
            borderRadius: "10px",
            cursor: "pointer",
            outline: "0",
            position: "relative" as 'relative',
            transition: "0.3s ease 0s",
            textDecoration: "none",
            textAlign: "left" as 'left',
            boxShadow: isHovered ? "inset 0 0 0 150px rgba(244,231,212, 0.1)" : "none"
        },
        light: {
            border: "#0C0C0C solid 1px",
            backgroundColor: "#f4e7d4",
            color: "#0C0C0C",
        },
        dark: {
            border: "#f4e7d4 solid 1px",
            backgroundColor: "#0C0C0C",
            color: "#f4e7d4",
        },
        loginButtonLogo: {
            display: "inline-block",
            width: "25px",
            height: "25px",
            position: "absolute" as 'absolute',
            left: "26px",
            top: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50%",
            backgroundImage: theme === "dark" ? 'url("https://sid-assets.s3.us-west-1.amazonaws.com/SID.svg")' : 'url("https://sid-assets.s3.us-west-1.amazonaws.com/SID_dark.svg")'
        },
        loginButtonText: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as 'nowrap',
        },
    };

    return (
        <a href={url}
           target={target}
           style={{...styles.loginButton, ...styles[theme]}}
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}
        >
            <span style={styles.loginButtonLogo}></span>
            <p style={styles.loginButtonText}>{buttonText}</p>
        </a>
    );
}

export default ConnectSidButton;
