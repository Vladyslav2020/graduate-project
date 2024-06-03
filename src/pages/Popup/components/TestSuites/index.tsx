import React, {useRef, useState} from "react";
import {TestSuite} from "../../interfaces/TestSuite";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import {TestCase} from "../../interfaces/TestCase";
import {ADD_TEST_SUITE, RootState, SET_ACTIVE_TEST_CASE, SET_TEST_SUITES, SHOW_RUNS} from "../../redux/Reducers";
import {useDispatch, useSelector} from "react-redux";
import {generateUniqueId} from "../../utils";

type CommandType = {
    id: string;
    dialogTitle: string;
    handler: any;
}

export const TestSuites = () => {
    const testSuites = useSelector((state: RootState) => state.root.testSuites);
    const dispatch = useDispatch();
    const activeTestCase = useSelector((state: RootState) => state.root.activeTestCase);
    const [expandedTestSuites, setExpandedTestSuites] = useState<string[]>(testSuites.map(suite => suite.id));
    const [dialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [activeItem, setActiveItem] = useState<TestSuite | TestCase | null>(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const [command, setCommand] = useState<CommandType | null>(null);
    const fileInputRef = useRef(null);

    const handleMoreTestSuiteOptionsClick = (event, testSuite) => {
        setAnchorEl(event.currentTarget);
        setActiveItem(testSuite);
    }

    const handleMoreTestCaseOptionsClick = (event, testCase) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setActiveItem(testCase);
    };

    const handleShowRuns = (event, testSuite, testCase) => {
        event.stopPropagation();
        dispatch({
            type: SET_ACTIVE_TEST_CASE,
            testSuite: testSuite,
            testCase: testCase,
        });
        dispatch({type: SHOW_RUNS});
    }

    const handleAddTestSuiteClick = () => {
        setInputValue('');
        setCommand({id: 'add-test-suite', dialogTitle: 'Add Test Suite', handler: handleAddTestSuite});
        setDialogOpen(true);
    }

    const handleAddTestCaseClick = (testSuite) => {
        setActiveItem(testSuite);
        setInputValue('');
        setCommand({id: 'add-test-case', dialogTitle: 'Add Test Case', handler: handleAddTestCase});
        setDialogOpen(true);
    };

    const handleAddTestSuite = () => {
        dispatch({
            type: ADD_TEST_SUITE, testSuite: {
                id: generateUniqueId(),
                title: inputValue,
                testCases: []
            }
        });
        setDialogOpen(false);
    }

    const handleAddTestCase = () => {
        let activeTestSuite;
        const newTestCase: TestCase = {
            id: generateUniqueId(),
            title: inputValue,
            steps: [],
            runs: [],
        };
        const newTestSuites = testSuites.map(testSuite => {
            if (testSuite.id === activeItem?.id) {
                activeTestSuite = testSuite;
                return {
                    ...testSuite,
                    testCases: [...testSuite.testCases, newTestCase]
                };
            }
            return testSuite;
        });
        dispatch({
            type: SET_TEST_SUITES,
            testSuites: newTestSuites,
        });
        dispatch({
            type: SET_ACTIVE_TEST_CASE,
            testSuite: activeTestSuite,
            testCase: newTestCase,
        });
        setDialogOpen(false);
    }

    const handleEditTestSuite = () => {
        if (!activeItem) {
            return;
        }
        const newTestSuites = testSuites.map(testSuite => {
            if (testSuite.id === activeItem.id) {
                return {...testSuite, title: inputValue};
            }
            return testSuite;
        });
        dispatch({
            type: SET_TEST_SUITES,
            testSuites: newTestSuites,
        });
        setDialogOpen(false);
        setActiveItem(null);
    }

    const handleEditTestCase = () => {
        const newTestSuites = testSuites.map(testSuite => {
            return {
                ...testSuite, testCases: testSuite.testCases.map(testCase => {
                    if (testCase.id === activeItem?.id) {
                        return {...testCase, title: inputValue};
                    }
                    return testCase;
                })
            };
        });
        dispatch({
            type: SET_TEST_SUITES,
            testSuites: newTestSuites,
        });
        setDialogOpen(false);
        setActiveItem(null);
    };

    const handleEditClick = () => {
        if (!activeItem) {
            return;
        }
        if (activeItem.hasOwnProperty('testCases')) {
            setCommand({id: 'edit-test-suite', dialogTitle: 'Edit Test Suite', handler: handleEditTestSuite});
        } else {
            setCommand({id: 'edit-test-case', dialogTitle: 'Edit Test Case', handler: handleEditTestCase});
        }
        setDialogOpen(true);
        setInputValue(activeItem.title);
        setAnchorEl(null);
    };

    const handleRemoveTestCase = () => {
        const newTestSuites = testSuites.map(testSuite => {
            return {...testSuite, testCases: testSuite.testCases.filter(testCase => testCase.id !== activeItem?.id)};
        });
        dispatch({
            type: SET_TEST_SUITES,
            testSuites: newTestSuites,
        });
        setDialogOpen(false);
        setActiveItem(null);
    };

    const handleRemoveTestSuite = () => {
        const newTestSuites = testSuites.filter(testSuite => testSuite.id !== activeItem?.id);
        dispatch({
            type: SET_TEST_SUITES,
            testSuites: newTestSuites,
        });
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveClick = () => {
        if (activeItem?.hasOwnProperty('testCases')) {
            handleRemoveTestSuite();
        } else {
            handleRemoveTestCase();
        }
        setAnchorEl(null);
    };

    const toggleTestSuite = (id: string) => {
        setExpandedTestSuites(prevState =>
            prevState.includes(id) ? prevState.filter(suiteId => suiteId !== id) : [...prevState, id]
        );
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    const handleCommand = () => {
        switch (command?.id) {
            case 'add-test-suite':
                handleAddTestSuite();
                break;
            case 'add-test-case':
                handleAddTestCase();
                break;
            case 'edit-test-suite':
                handleEditTestSuite();
                break;
            case 'edit-test-case':
                handleEditTestCase();
                break;
        }
    }

    const setActiveTestCase = (testSuite, testCase) => {
        dispatch({
            type: SET_ACTIVE_TEST_CASE,
            testSuite: testSuite,
            testCase: testCase,
        });
    }

    const exportTestSuite = (testSuite: TestSuite) => {
        const jsonData = JSON.stringify({
            ...testSuite,
            testCases: testSuite.testCases.map(testCase => ({
                id: testCase.id,
                title: testCase.title,
                steps: testCase.steps
            }))
        });

        const blob = new Blob([jsonData], {type: 'application/json'});

        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: 'test-suite.json',
            saveAs: true
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Error exporting test suite:', chrome.runtime.lastError.message);
            } else {
                console.log('Test suite exported to test-suite.json');
            }
        });
    }

    const importTestSuite = () => {
        if (!fileInputRef.current) {
            return;
        }
        (fileInputRef.current as HTMLInputElement).click();
    }

    const handleImportFile = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            if (!e.target.result) {
                return;
            }
            const jsonData = JSON.parse(e.target.result as string);
            if (!jsonData) {
                return;
            }
            const newTestSuite: TestSuite = {
                id: generateUniqueId(),
                title: jsonData.title,
                testCases: jsonData.testCases.map(testCase => ({
                    id: generateUniqueId(),
                    title: testCase.title,
                    steps: testCase.steps,
                    runs: []
                }))
            };
            dispatch({
                type: SET_TEST_SUITES,
                testSuites: [...testSuites, newTestSuite],
            });
        };
        reader.readAsText(file);
    }

    return (
        <div style={{padding: '0 20px', minWidth: '352px'}}>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <Typography>Test Suites</Typography>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json"
                            hidden
                            onChange={handleImportFile}
                        />
                        <IconButton title='Import test suite' color='primary' onClick={importTestSuite}>
                            <GetAppRoundedIcon/>
                        </IconButton>
                        <Button variant="outlined" size='small' onClick={handleAddTestSuiteClick}>+ Test Suite</Button>
                    </div>
                </div>
                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>{command?.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Title" type="text" fullWidth value={inputValue}
                                   onChange={e => setInputValue(e.target.value)}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleCommand}>Save</Button>
                    </DialogActions>
                </Dialog>
                <div>
                    {testSuites.map((testSuite) => (
                        <div key={testSuite.id} style={{marginBottom: '10px'}}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid black'
                            }}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <IconButton size='small' onClick={() => toggleTestSuite(testSuite.id)}>
                                        {expandedTestSuites.includes(testSuite.id) ? <KeyboardArrowDownRoundedIcon/> :
                                            <ChevronRightRoundedIcon/>}
                                    </IconButton>
                                    <Typography title={testSuite.title} noWrap sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '140px',
                                    }}>{testSuite.title}</Typography>
                                </div>
                                <div style={{width: '178px'}}>
                                    <IconButton title='Export test suite'
                                                onClick={() => exportTestSuite(testSuite)}
                                                color='primary'><PublishRoundedIcon/></IconButton>
                                    <Button size='small' variant="text"
                                            onClick={() => handleAddTestCaseClick(testSuite)}>+ Test Case</Button>
                                    <IconButton title='More actions'
                                                onClick={(event) => handleMoreTestSuiteOptionsClick(event, testSuite)}>
                                        <MoreVertRoundedIcon/>
                                    </IconButton>
                                </div>
                            </div>
                            {expandedTestSuites.includes(testSuite.id) && (
                                <div style={{marginLeft: '50px'}}>
                                    {testSuite.testCases.map((testCase) => (
                                        <Button key={testCase.id} component='div'
                                                onClick={() => setActiveTestCase(testSuite, testCase)} color={'inherit'}
                                                variant='text' sx={{
                                            display: 'flex',
                                            padding: '0 0 0 10px',
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            textTransform: 'none',
                                            backgroundColor: activeTestCase?.id === testCase.id ? '#eaeaea' : 'inherit',
                                        }}>
                                            <Typography title={testCase.title} noWrap
                                                        sx={{maxWidth: '200px'}}>{testCase.title}</Typography>
                                            <div style={{width: '80px'}}>
                                                <IconButton title='View statistics'
                                                            onClick={(event) => handleShowRuns(event, testSuite, testCase)}><ShowChartRoundedIcon/></IconButton>
                                                <IconButton title='More actions'
                                                            onClick={(event) => handleMoreTestCaseOptionsClick(event, testCase)}><MoreVertRoundedIcon/></IconButton>
                                            </div>
                                        </Button>
                                    ))}
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                                        <MenuItem onClick={handleRemoveClick}>Remove</MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};