import React, {useEffect, useRef, useState} from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from '@mui/material';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {TestCase} from "../../interfaces/TestCase";
import {aiGenerationService} from "../../services/AIGenerationService";
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import remarkHighlight from 'remark-highlight.js';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/default.css';
import './index.css';

hljs.registerLanguage('javascript', javascript);

type CodeGenerationDialogProps = {
    testCase: TestCase;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export const CodeGenerationDialog = ({testCase, open, setOpen}: CodeGenerationDialogProps) => {
    const [generatedCode, setGeneratedCode] = useState(`\`\`\`javascript
// code will be generated here
\`\`\``);
    const [codeGenerating, setCodeGenerating] = useState(false);
    const [language, setLanguage] = useState('JavaScript');
    const codeFieldRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleGenerate = async () => {
        setCodeGenerating(true);
        await aiGenerationService.getCodeForTestCase(testCase, setGeneratedCode);
        setCodeGenerating(false);
    };

    useEffect(() => {
        if (codeFieldRef.current) {
            const codeSnippet = codeFieldRef.current.querySelector('.code-snippet') as HTMLDivElement;
            codeSnippet.scrollTop = codeSnippet.scrollHeight;
        }
    }, [generatedCode]);

    const components: any = {
        code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <pre className={className} {...props}>
                  <code className={`hljs ${match[0]}`}>{children}</code>
                </pre>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    useEffect(() => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block as HTMLElement);
        });
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
                <Box ref={codeFieldRef} sx={{backgroundColor: '#F3F3F3'}}
                     mt={2} position="relative">
                    <ReactMarkdown className='code-snippet' remarkPlugins={[remarkGfm, remarkHighlight as any]}
                                   components={components}>{generatedCode}</ReactMarkdown>
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
