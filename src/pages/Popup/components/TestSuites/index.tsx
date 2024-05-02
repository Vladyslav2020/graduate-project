import React, {useState} from "react";
import {TestSuite} from "../../interfaces/TestSuite";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
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
import {ADD_TEST_SUITE, RootState, SET_ACTIVE_TEST_CASE, SET_TEST_SUITES} from "../../redux/Reducers";
import {useDispatch, useSelector} from "react-redux";
import {generateUniqueId} from "../../utils";

type CommandType = {
    id: string;
    dialogTitle: string;
    handler: any;
}

type TestSuitesProps = {
    setShowTestRuns: (arg: boolean) => void;
}

export const TestSuites = ({setShowTestRuns}: TestSuitesProps) => {
    const testSuites = useSelector((state: RootState) => state.root.testSuites);
    const dispatch = useDispatch();
    const [expandedTestSuites, setExpandedTestSuites] = useState<string[]>(testSuites.map(suite => suite.id));
    const [dialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [activeItem, setActiveItem] = useState<TestSuite | TestCase | null>(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const [command, setCommand] = useState<CommandType | null>(null);

    const handleMoreTestSuiteOptionsClick = (event, testSuite) => {
        setAnchorEl(event.currentTarget);
        setActiveItem(testSuite);
    }

    const handleMoreTestCaseOptionsClick = (event, testCase) => {
        setAnchorEl(event.currentTarget);
        setActiveItem(testCase);
    };

    const handleShowRuns = (event, testSuite, testCase) => {
        event.stopPropagation();
        setShowTestRuns(true);
        dispatch({
            type: SET_ACTIVE_TEST_CASE,
            testSuite: testSuite,
            testCase: testCase,
        });
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
        const newTestSuites = testSuites.map(testSuite => {
            if (testSuite.id === activeItem?.id) {
                const newTestCase: TestCase = {
                    id: generateUniqueId(),
                    title: inputValue,
                    steps: [],
                    runs: [],
                };
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
        setShowTestRuns(false);
        dispatch({
            type: SET_ACTIVE_TEST_CASE,
            testSuite: testSuite,
            testCase: testCase,
        });
    }

    return (
        <div style={{padding: '20px', minWidth: '300px'}}>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <Typography>Test Suites</Typography>
                    <Button variant="outlined" size='small' onClick={handleAddTestSuiteClick}>+ Test Suite</Button>
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
                                    <Typography> {testSuite.title}</Typography>
                                </div>
                                <div>
                                    <Button size='small' variant="outlined"
                                            onClick={() => handleAddTestCaseClick(testSuite)}>+ Test Case</Button>
                                    <IconButton style={{marginLeft: '10px'}}
                                                onClick={(event) => handleMoreTestSuiteOptionsClick(event, testSuite)}>
                                        <MoreVertRoundedIcon/>
                                    </IconButton>
                                </div>
                            </div>
                            {expandedTestSuites.includes(testSuite.id) && (
                                <div style={{marginLeft: '50px'}}>
                                    {testSuite.testCases.map((testCase) => (
                                        <Button key={testCase.id} component='div'
                                                onClick={() => setActiveTestCase(testSuite, testCase)} color='inherit'
                                                variant='text' sx={{
                                            display: 'flex',
                                            paddingRight: '0',
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            textTransform: 'none',
                                        }}>
                                            <Typography>{testCase.title}</Typography>
                                            <IconButton onClick={(event) => handleShowRuns(event, testSuite, testCase)}><ShowChartRoundedIcon/></IconButton>
                                            <IconButton
                                                onClick={(event) => handleMoreTestCaseOptionsClick(event, testCase)}><MoreVertRoundedIcon/></IconButton>
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