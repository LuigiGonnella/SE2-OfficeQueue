import {Col, Row, Button, Card, ListGroup, Container} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import {DefaultApiAxiosParamCreator} from "../API/api.ts";

function SList() {
    
    return (

        
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '18rem' }}>
                <ListGroup variant="flush">
                <ListGroup.Item>Service 1</ListGroup.Item>
                <ListGroup.Item>Service 2</ListGroup.Item>
                <ListGroup.Item>Service 3</ListGroup.Item>
                </ListGroup>
            </Card>
        </Container>
    )
}
export default SList;