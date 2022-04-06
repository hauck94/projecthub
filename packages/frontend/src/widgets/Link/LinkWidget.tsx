import styled from 'styled-components';
import Widget from '../../components/Widget';
import { LinkWidgetData } from './LinkWidgetModel';

const WidgetBackground = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;

  & .inner-link-content {
    transition: transform 200ms;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  &:hover .inner-link-content {
    transform: scale(0.9);
  }
`;

const ImageLinkName = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  margin-top: 5px;
  color: black;
  text-align: center;
`;

const LinkName = styled.h3`
  margin: 0;
  text-align: center;
`;

const LinkWidget: Widget<LinkWidgetData> = ({ saveData, data }) => {
  return (
    <WidgetBackground
      style={{ backgroundColor: data.data.backgroundColor }}
      onClick={() => window.open(data.data.url, '_blank')}
    >
      <div className="inner-link-content" style={data.data.logo ? { marginBottom: '-20px' } : {}}>
        {data.data.logo ? (
          <>
            <img src={data.data?.logo} alt="logo" style={{ width: '90px' }} />
            <ImageLinkName style={{ color: data.data.fontColor }}>{data.data.title}</ImageLinkName>
          </>
        ) : (
          <LinkName style={{ color: data.data.fontColor }}>{data.data.title}</LinkName>
        )}
      </div>
    </WidgetBackground>
  );
};

export default LinkWidget;
