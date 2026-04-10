import { StateStart } from '@renderer/hooks/runtime'
import React from 'react'
import { Col, Container, Row, Image } from 'react-bootstrap'

/* @ts-ignore-next-line need to do the generics magic in ScreenView.tsx ¯\_(ツ)_/¯ */
const StartScreen: React.FC = ({ name, location, date, author }: StateStart['data']) => {
  return (
    <>
      <Container fluid className="h-100 d-flex align-items-center">
        <Row className="d-flex align-items-center w-100">
          <Col xs="auto" className="d-flex justify-content-center">
            {(() => {
              const [imageLoaded, setImageLoaded] = React.useState(false)
              React.useEffect(() => {
                const img = new window.Image()
                img.onload = () => setImageLoaded(true)
                img.src = 'https://placehold.co/1280x720'
              }, [])

              return imageLoaded ? (
                <Image src="https://placehold.co/1280x720" alt="Logo" fluid />
              ) : (
                <div>Loading image...</div>
              )
            })()}
          </Col>
          <Col className="d-flex align-items-center flex-grow-1">
            <Col className="d-flex flex-column justify-content-center text-center">
              <h1 style={{ fontSize: '8rem' }}>{name}</h1>
              <h2 style={{ fontSize: '5rem' }}>{location}</h2>
              <h2>{date}</h2>
              <h3 style={{ fontSize: '3rem' }}>by: {author}</h3>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default StartScreen
