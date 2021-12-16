import styled from 'styled-components';

export const LogoStyles = styled.div`
    height: 6ex;
    left: 1ex;
    top: 1ex;
    z-index: 999;
    display: flex;
    align-items: center;
    margin-right: 3rem;
`;

export const LogoImage = styled.img`
    border-right: 1px solid #555;
    margin-right: 0.6ex;
    padding-right: 0.6ex;
    object-fit: contain;
    vertical-align: middle;
    width: 5ex;
    ~ .logoText {
        color: #0094e2;
        font-size: 5ex;
        vertical-align: middle;
        font-family: 'Mabry Pro';
    }
`;

export const MapGuideButton = styled('div')`
    margin-left: 15px;
    margin-top: 7px;
    .help-guide-button {
        text-decoration: none;
        cursor: pointer;
        user-select: none;
        background-color: transparent;
        display: flex;
        min-width: 64px;
        padding: 7px;
        box-sizing: border-box;
        font-family: 'Mabry Pro', sans-serif;
        font-weight: 500;
        border-radius: 4px;
        text-transform: uppercase;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
            border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size: 6px;
        border: 1px solid #0094e2;
        align-items: center;
        .MuiSvgIcon-root {
            fill: #0094e2;
            width: 1em;
            height: 1em;
            display: inline-block;
            font-size: 1.5rem;
            transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            flex-shrink: 0;
            user-select: none;
        }
        .map-guide-text {
            color: #0094e2;
        }
    }
    span {
        text-transform: uppercase;
        margin-left: 6px;
        font-size: 4ex !important;
        vertical-align: middle;
        text-decoration: none;
        font-family: 'Mabry Pro';
    }
`;

export const ModalContent = styled('div')`
    cursor: move;
    dsplay: flex;
    flex-direction: column;
    position: absolute;
    overflow: hidden;
    z-index: 17;
    user-select: none;
    padding: 20px;
    background: #0094e2;
    color: #fff;
    font-family: 'Mabry Pro', sans-serif;
    width: 50%;

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    .modal-cancel {
        position: absolute;
        display: flex;
        cursor: pointer;
        right: 30px;
        width: fit-content;
    }
    h1 {
        font-family: 'Mabry Pro', sans-serif;
        font-weight: normal;
        text-align: center;
        margin-top: 20px;
    }
    p {
        font-family: Inter, Helvetica, Arial, sans-serif;
        margin: 1.5rem auto;
        a {
            text-decoration: underline;
            color: #fff;
        }
    }
`;
