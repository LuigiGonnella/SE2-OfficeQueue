import {Col, Row, Button} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
    return (
        <>
        <Row className="vh-100 justify-content-center align-items-center">
            <Col md={10} lg={8} className="text-center">
                <Link className="button" to="/officers">Officer</Link>
                <Link className="button" to="/services">Customer</Link>
            </Col>
        </Row>
            
        
        </>
    )
}

export default HomePage;