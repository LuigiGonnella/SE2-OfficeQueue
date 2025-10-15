import {Col, Row, Button, ButtonGroup} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import QNavbar from "../components/QNavbar.tsx";


function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <QNavbar />
            <div className="d-flex justify-content-center align-items-center" style={{height: '85vh'}}>
                <Col className="w-100 text-center">
                    <h1 className="pb-5">Select interface</h1>
                    <ButtonGroup vertical={true} style={{width: '300px'}}>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/services')}>Customer Panel</Button>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/officers')}>Officer Panel</Button>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/board')}>Info Board</Button>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/newservice')}>New Service</Button>
                    </ButtonGroup>
                </Col>
            </div>
        </>
    )
}

export default HomePage;
