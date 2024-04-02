import {TableCell, TableRow} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {TestStep} from "../../interfaces/test-step";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";


type TestStepProps = {
    id: string;
    testStep: TestStep;
}

export const TestCaseStep = ({id, testStep}: TestStepProps) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <TableRow
            sx={{"&:last-child td, &:last-child th": {border: 0}}}
            style={style}
            {...attributes}
            {...listeners}
            ref={setNodeRef}
        >
            <TableCell
                component="th"
                scope="row"
            >
                <DragIndicatorIcon/>
            </TableCell>
            <TableCell>{testStep.name}</TableCell>
            <TableCell>{testStep.element}</TableCell>
            <TableCell>{testStep.value}</TableCell>
        </TableRow>
    )
}