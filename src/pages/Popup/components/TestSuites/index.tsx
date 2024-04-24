import React, {useState} from "react";
import {TestSuite} from "../../interfaces/TestSuite";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
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

type CommandType = {
    id: string;
    dialogTitle: string;
    handler: any;
}

export const TestSuites = () => {
    const initialTestSuites = [
        {
            id: '1',
            title: 'Test Suite 1',
            testCases: [{id: '1', title: 'Test Case 1', commands: []}, {id: '2', title: 'Test Case 2', commands: []}]
        },
        {
            id: '2',
            title: 'Test Suite 2',
            testCases: [{id: '3', title: 'Test Case 3', commands: []}, {id: '4', title: 'Test Case 4', commands: []}]
        },
    ];
    const [testSuites, setTestSuites] = useState<TestSuite[]>(initialTestSuites);
    const [expandedTestSuites, setExpandedTestSuites] = useState<string[]>(initialTestSuites.map(suite => suite.id));
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
        setTestSuites([...testSuites, {
            id: String(testSuites.length + 1),
            title: inputValue,
            testCases: []
        }]);
        setDialogOpen(false);
    }

    const handleAddTestCase = () => {
        const newTestSuites = testSuites.map(testSuite => {
            if (testSuite.id === activeItem?.id) {
                return {
                    ...testSuite,
                    testCases: [...testSuite.testCases, {
                        id: String(testSuite.testCases.length + 1),
                        title: inputValue,
                        commands: []
                    }]
                };
            }
            return testSuite;
        });
        setTestSuites(newTestSuites);
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
        setTestSuites(newTestSuites);
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
        setTestSuites(newTestSuites);
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
        setTestSuites(newTestSuites);
        setDialogOpen(false);
        setActiveItem(null);
    };

    const handleRemoveTestSuite = () => {
        const newTestSuites = testSuites.filter(testSuite => testSuite.id !== activeItem?.id);
        setTestSuites(newTestSuites);
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

    return (
        <div style={{padding: '20px', width: '280px'}}>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <Typography>Test Suites</Typography>
                    <Button variant="outlined" onClick={handleAddTestSuiteClick}>+ Test Suite</Button>
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
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <IconButton size='small' sx={{borderRadius: '5px'}}
                                            onClick={() => toggleTestSuite(testSuite.id)}>
                                    {expandedTestSuites.includes(testSuite.id) ? <KeyboardArrowDownRoundedIcon/> :
                                        <ChevronRightRoundedIcon/>}
                                    <Typography> {testSuite.title}</Typography>
                                </IconButton>
                                <Button variant="outlined" onClick={() => handleAddTestCaseClick(testSuite)}>+ Test
                                    Case</Button>
                                <IconButton
                                    onClick={(event) => handleMoreTestSuiteOptionsClick(event, testSuite)}><MoreVertRoundedIcon/></IconButton>
                            </div>
                            {expandedTestSuites.includes(testSuite.id) && (
                                <div style={{marginLeft: '20px'}}>
                                    {testSuite.testCases.map((testCase) => (
                                        <div key={testCase.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}>
                                            <Typography>{testCase.title}</Typography>
                                            <IconButton
                                                onClick={(event) => handleMoreTestCaseOptionsClick(event, testCase)}><MoreVertRoundedIcon/></IconButton>
                                        </div>
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