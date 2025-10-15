import {Button, Col, ButtonGroup} from "react-bootstrap";
import {useNavigate} from "react-router";
import QNavbar from "../components/QNavbar.tsx";

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <QNavbar />
            <div className="d-flex justify-content-center align-items-center" style={{height: '85vh'}}>
                <Col className="w-100 text-center">
                    <h1 className="pb-5">Select interface</h1>
                    <ButtonGroup vertical={true} style={{width: '300px'}}>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/customer-panel')}>Customer Panel</Button>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/officer-panel')}>Officer Panel</Button>
                        <Button variant="outline-primary" className="my-2" style={{height: '75px'}} onClick={() => navigate('/info-board')}>Info Board</Button>
                    </ButtonGroup>
                </Col>
            </div>
        </>
    )
}

export default Home
