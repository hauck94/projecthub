import Widget from '../../components/Widget';
import { uuidv4 } from '../../utils/Utils';
import { NotesWidgetData } from './NotesWidgetModel';

const NotesWidget: Widget<NotesWidgetData> = ({ saveData, data: widgetData }) => {
  if (!widgetData.data?.token) {
    saveData({
      ...widgetData,
      data: {
        backgroundColor: widgetData.data?.backgroundColor ?? '#fcd059',
        token: uuidv4(),
      },
    });
  }

  return (
    <div style={{ height: '100%', backgroundColor: widgetData.data?.backgroundColor }}>
      <iframe
        title="note"
        name="embed_readwrite"
        src={`${window.location.protocol}//${process.env.REACT_APP_NOTES_URL}/p/note-${widgetData.data?.token}?showControls=true&showChat=false&showLineNumbers=false&useMonospaceFont=false&noColors=true`}
        width="100%"
        height="100%"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default NotesWidget;
