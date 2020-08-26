export type BreakPointPassType = -1 | 1;

export interface DocumentState {
    bodyClass: string[];
    breakpointPassed?: BreakPointPassType;
    height: number;
    width: number;
    isSwiftBot: boolean;
}

export const initialDocumentState: DocumentState = {
    bodyClass: [],
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    isSwiftBot: false,
};
