import { Container, Navbar } from "react-bootstrap";

function QNavbar() {
    return (
        <Navbar bg="primary" variant="dark" style={{height:'7vh'}}>
            <Container>
                <Navbar.Brand>Office Queue management</Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default QNavbar;