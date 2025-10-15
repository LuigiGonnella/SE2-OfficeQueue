import {Col, Row, Button, Card, ListGroup} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';

function SList() {
    return (
        <>
            <Card style={{ width: '18rem' }}>
                <ListGroup variant="flush">
                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
            </Card>
        </>
    )
}
export default SList;