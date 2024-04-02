import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {useState} from "react";
import {closestCorners, DndContext} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {TestCaseStep} from "../TestCaseStep";

export const TestCaseSteps = () => {
    // TODO: retrieve data from localStorage
    const [rows, setRows] = useState([
        {id: '1', name: 'open', element: 'https://www.google.com'},
        {id: '2', name: 'type', element: 'input[name=q]', value: 'test'},
        {
            id: '3', name: 'click', element: 'input[name=btnK]'
        },
        {
            id: '4', name: 'click', element: 'input[name=btnK]'
        },
        {
            id: '5', name: 'assert', element: 'input[name=btnK]', value: 'test'
        },
    ]);

    const handleDragEnd = (e) => {
        const {active, over} = e;

        if (!active || !over || active.id === over.id) {
            return;
        }

        const getRowIndex = (id) => rows.findIndex((row) => row.id === id);

        setRows((rows) => {
            const originalPos = getRowIndex(active.id);
            const newPos = getRowIndex(over.id);
            return arrayMove(rows, originalPos, newPos);
        });
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <Table sx={{minWidth: 650}} aria-label="commands table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Command</TableCell>
                        <TableCell>Element</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <SortableContext items={rows} strategy={verticalListSortingStrategy}>
                        {rows.map((row) => (
                            <TestCaseStep key={row.id} id={row.id} testStep={row}/>
                        ))}
                    </SortableContext>
                </TableBody>
            </Table>
        </DndContext>
    )
}