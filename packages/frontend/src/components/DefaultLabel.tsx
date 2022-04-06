import styled from 'styled-components';

const Label = styled.span`
  font-weight: 500;
  padding-bottom: 2px;
  font-size: 12pt;
  display: inline-block;
`;

interface LabelProps {
  tooltip?: string;
  style?: React.CSSProperties;
}

const DefaultLabel: React.FC<LabelProps> = ({ style, children, tooltip }) => {
  return (
    <Label title={tooltip} style={tooltip ? { ...style, cursor: 'help' } : style}>
      {children}
    </Label>
  );
};

export default DefaultLabel;
