import { useState } from "react";
import { Col, Button, ButtonGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import QNavbar from "../components/QNavbar.tsx";

function HomePage() {
    const navigate = useNavigate();
    const [devMode, setDevMode] = useState(false);

    return (
        <>
            <QNavbar />
            <div className="d-flex justify-content-center align-items-center" style={{height: '85vh'}}>
                <Col className="w-100 text-center">
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        zIndex: 1000
                    }}>
                        <Form.Check
                            type="switch"
                            id="dev-mode-toggle"
                            label="Dev Mode"
                            checked={devMode}
                            onChange={(e) => setDevMode(e.target.checked)}
                            className="fs-5"
                        />
                    </div>

                    <h1 className="pb-5">Select interface</h1>

                    <ButtonGroup vertical={true} style={{width: '300px'}}>
                        <Button
                            variant="outline-primary"
                            className="my-2"
                            style={{height: '75px'}}
                            onClick={() => navigate('/services')}
                        >
                            Customer Panel
                        </Button>
                        <Button
                            variant="outline-primary"
                            className="my-2"
                            style={{height: '75px'}}
                            onClick={() => navigate('/officers')}
                        >
                            Officer Panel
                        </Button>
                        <Button
                            variant="outline-primary"
                            className="my-2"
                            style={{height: '75px'}}
                            onClick={() => navigate('/board')}
                        >
                            Info Board
                        </Button>

                        {devMode && (
                            <>
                                <Button
                                    variant="outline-secondary"
                                    className="my-2"
                                    style={{height: '75px'}}
                                    onClick={() => navigate('/newservice')}
                                >
                                    New Service
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    className="my-2"
                                    style={{height: '75px'}}
                                    onClick={() => navigate('/newcustomer')}
                                >
                                    New Customer
                                </Button>
                            </>
                        )}
                    </ButtonGroup>
                </Col>
            </div>
        </>
    );
}

export default HomePage;
