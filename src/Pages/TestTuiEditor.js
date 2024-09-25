import React from 'react';
   import ImageEditor from '@toast-ui/react-image-editor';
   import 'tui-image-editor/dist/tui-image-editor.css';

   const TestTuiEditor = () => {
     return (
       <div>
         <h1>TUI Image Editor Test</h1>
         <ImageEditor
           includeUI={{
             menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
             initMenu: 'filter',
             uiSize: {
               width: '1000px',
               height: '700px',
             },
             menuBarPosition: 'bottom',
           }}
           cssMaxHeight={500}
           cssMaxWidth={700}
           selectionStyle={{
             cornerSize: 20,
             rotatingPointOffset: 70,
           }}
           usageStatistics={true}
         />
       </div>
     );
   };

   export default TestTuiEditor;