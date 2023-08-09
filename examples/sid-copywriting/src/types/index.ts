import React from "react";

export enum TemplateType {
    text,
    mail,
    chat
}

export type Template = {
    buttonText: string,
    type: TemplateType,
    backgroundImage: string,
    input: string,
    outputWithSID: string,
    outputWithoutSID: string
};

export type TypingState = Map<string, {
    typingRef: React.RefObject<HTMLElement>,
    typingQueue: string[],
    typingOutput: string[],
    isTyping: boolean,
    typingInterval: NodeJS.Timer | null,
}> | null;

export type CopyWritingProps = {
    template: Template
}

export type SetTypingState = React.Dispatch<React.SetStateAction<TypingState>>;