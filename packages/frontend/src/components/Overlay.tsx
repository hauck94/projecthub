import ReactDOM from 'react-dom';
import styled, { CSSProperties } from 'styled-components';

const OverlayBackdrop = styled.div`
  z-index: 900;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
  padding: 30px;
`;

const OverlayBody = styled.div`
  max-width: 100%;
  max-height: 100%;
  border-radius: 7px;
  overflow: hidden;
  box-shadow: 0px 13px 54px -6px rgba(0, 0, 0, 0.4);
`;
interface OverlayProps {
  style?: CSSProperties;
  show: boolean;
  onClose?: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, show, style }) => {
  const modalRoot = document.getElementById('modal-root');

  if (modalRoot) {
    return ReactDOM.createPortal(
      <OverlayBackdrop onMouseDown={(e) => e.stopPropagation()} style={{ display: show ? 'flex' : 'none' }}>
        <OverlayBody style={style}>{children}</OverlayBody>
      </OverlayBackdrop>,
      modalRoot,
    );
  } else {
    return <p>An Error occurred! Couldn't find DOM element with the following id: 'modal-root'.</p>;
  }
};

export default Overlay;
