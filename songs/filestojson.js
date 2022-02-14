const { readdirSync, writeFileSync, lstatSync } = require('node:fs');

const songs = readdirSync(__dirname);
const json = [];

songs.forEach(genre => {
  const songdir = `${__dirname}/${genre}`;

  if (!lstatSync(songdir).isDirectory()) {
    return;
  }

  readdirSync(songdir).forEach(song => {
    const record = {
      title : '',
      source: '',
      genre : `${genre.replace(/_/g, ' ')}`,
      links : {},
    };

    [record.source, record.title] = song.split('_-_');
    record.source = record.source.replace(/_/g, ' ');
    record.title = record.title.replace(/_/g, ' ');

    if (!lstatSync(`${songdir}/${song}`).isDirectory()) {
      return;
    }

    readdirSync(`${songdir}/${song}`).forEach(file => {
      if (file.endsWith('.pdf')) {
        record.links.sheet = `songs/${genre}/${song}/${file}`;
      }

      if (file.endsWith('.mid')) {
        record.links.midi = `songs/${genre}/${song}/${file}`;
      }
    });

    json.push(record);
  });
});

writeFileSync('../songslist.json', JSON.stringify(json, null, 2), 'utf8');