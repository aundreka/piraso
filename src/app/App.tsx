import { ReactFlowProvider } from '@xyflow/react';
import QueryCanvas from '../components/canvas/QueryCanvas';

export default function App() {
  return (
    <ReactFlowProvider>
      <QueryCanvas />
    </ReactFlowProvider>
  );
}
