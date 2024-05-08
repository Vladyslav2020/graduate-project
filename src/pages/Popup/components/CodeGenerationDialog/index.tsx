import React, {useEffect, useRef, useState} from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from '@mui/material';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {TestCase} from "../../interfaces/TestCase";
import {aiGenerationService} from "../../services/AIGenerationService";

type CodeGenerationDialogProps = {
    testCase: TestCase;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export const CodeGenerationDialog = ({testCase, open, setOpen}: CodeGenerationDialogProps) => {
    const [generatedCode, setGeneratedCode] = useState('');
    const [codeGenerating, setCodeGenerating] = useState(false);
    const [language, setLanguage] = useState('JavaScript');
    const textFieldRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleGenerate = async () => {
        setCodeGenerating(true);
        await aiGenerationService.getCodeForTestCase(testCase, setGeneratedCode);
        setCodeGenerating(false);
    };

    useEffect(() => {
        if (textFieldRef.current) {
            const textarea = textFieldRef.current.querySelector('textarea') as HTMLTextAreaElement;
            textarea.scrollTop = textarea.scrollHeight;
        }
    }, [generatedCode]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Code Generation for Test Case: {testCase.title}</DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    <TextField
                        label="Language"
                        value={language}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box mt={2} position="relative">
                    <TextField
                        ref={textFieldRef}
                        label="Generated Code"
                        multiline
                        rows={10}
                        value={generatedCode}
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiInputBase-root': {
                                paddingRight: 0,
                            },
                        }}
                    />
                    <CopyToClipboard text={generatedCode}>
                        <IconButton title='Copy to Clipboard' sx={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                        }}>
                            <ContentCopyRoundedIcon/>
                        </IconButton>
                    </CopyToClipboard>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={codeGenerating} onClick={handleGenerate}>
                    Generate
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
