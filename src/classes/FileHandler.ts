export default class FileHandler {
  public static async handleJsonFile(evt) {
    return new Promise( (resolve, reject) => {
      if (evt.target.files.length === 0) {
        reject('No file selected');
      }

      if (evt.target.files.length > 1) {
        reject('Only one file can be selected');
      }

      const file: any = evt.target.files[0]; // FileList object

      // Only process json files.
      if (!file.type.match('json.*')) {
        reject('Only JSON files supported');
      }

      const reader: any = new FileReader();

      // Closure to capture the file information.
      reader.onload = ( (theFile) => {
        return (e) => {
          // Render thumbnail.
          resolve(JSON.parse(e.target.result));
        };
      })(file);

      // Read in the file as a data URL.
      reader.readAsText(file);
    });
  }

  public static downloadJsonFile(filename, json) {
    const a: any = document.createElement('a');
    const stringifiedJson = JSON.stringify(json, null, 2);
    const encodedURIComponent = encodeURIComponent(stringifiedJson)
    a.setAttribute('download', filename);
    a.setAttribute('href', `data:text/json;charset=utf-8,${encodedURIComponent}`);
    a.style.display = 'none';
    document.getElementsByTagName('body')[0].appendChild(a);
    a.click();
    document.getElementsByTagName('body')[0].removeChild(a);
  }

  public static downloadMidiFile(filename: string, data) {
    // Create a Blob from the MIDI data ArrayBuffer
    const blob = new Blob([data], {type: 'audio/midi'});

    // Create an object URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create an <a> element to facilitate downloading
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;

    // Append the <a> element to the DOM and trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up by revoking the object URL and removing the <a> element
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
