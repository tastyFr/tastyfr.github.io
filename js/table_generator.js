/* eslint-disable no-undef */
function createTable() {
  const songsTable = $('<div>', {
    class: 'container row myblack white-text',
    style: 'text-transform: uppercase; padding: 8pt',
    id   : 'songsBox',
  });

  const tableContainer = $('<div>', { class: 'col s12' });
  const table = $('<table>', { id: 'idSongsTable', class: 'highlight' });
  const thead = $('<thead>');
  const tbody = $('<tbody>');

  const tr = $('<tr>');
  const td = $('<td>', {
    colspan: '4',
    class  : 'center',
    text   : 'Loading songs...',
  });

  tr.append(td);
  tbody.append(tr);
  table.append(thead);
  table.append(tbody);

  tableContainer.append(table);
  songsTable.append(tableContainer);

  return songsTable;
}

$(document).ready(async () => {
  $('#tooSmall').after(createTable());

  const json = await fetch('songslist.json');
  const songs = await json.json();

  let links = '';
  links = data => {
    const random = Math.random().toString(36).substring(2, 15);

    const button = $('<a>', {
      class:
        'dropdown-trigger '
        + 'btn waves-effect waves-light mywaves-light mygray-dim',
      'data-target' : `dropdown-${random}`,
      'data-tooltip': 'Uh, what are you waiting for?',
      href          : '#!',
      text          : 'Download Files',
    });

    const ul = $('<ul>', {
      id   : `dropdown-${random}`,
      class: 'dropdown-content',
    });

    if (data.links.sheet) {
      const li = $('<li>');
      const a = $('<a>', { href: data.links.sheet, target: '_blank' });

      a.html(
        '<i class="material-icons">description</i>'
          + 'Sheet Music<span class="badge">(.pdf)</span>',
      );

      li.append(a);
      ul.append(li);
    }

    if (data.links.midi) {
      if (data.links.sheet) {
        const div = $('<div>', { class: 'divider' });
        ul.append(div);
      }

      const li = $('<li>');
      const a = $('<a>', { href: data.links.midi, target: '_blank' });

      a.html(
        '<i class="material-icons">music_note</i>'
          + 'MIDI File<span class="badge">(.mid)</span>',
      );

      li.append(a);
      ul.append(li);
    }

    const div = $('<div>');
    div.append(button);
    div.append(ul);

    return div[0].outerHTML;
  };

  const options = {
    columns: [
      { data: 'title' },
      { data: 'source' },
      { data: 'genre' },
      { data: links },
    ],
    data      : songs,
    lengthMenu: [5, 10, 25, songs.length],
    language  : {
      emptyTable    : 'Whoops! Looks like there are no songs here! :[',
      info          : 'Showing _START_ to _END_ of _TOTAL_ songs',
      infoEmpty     : 'Showing 0 to 0 of 0 songs',
      infoFiltered  : '(filtered from _MAX_ total songs)',
      loadingRecords: 'Loading songs...',
      paginate      : { previous: 'Previous', next: 'Next' },
      search        : '',
      zeroRecords   : 'No matching songs found! :[',
      lengthMenu    : 'Show songs: _MENU_ Filter Songs:',
    },
    order     : [],
    pageLength: songs.length,
    responsive: true,
  };

  const tr = $('<tr>');

  const th = [
    $('<th>', { text: 'Title' }),
    $('<th>', { text: 'Source' }),
    $('<th>', { text: 'Genre' }),
    $('<th>', { text: 'Links' }),
  ];

  tr.append(...th);
  $('thead').append(tr);

  const table = $('#idSongsTable').DataTable(options);

  M.Dropdown.init($('.dropdown-trigger'), {
    alignment     : 'right',
    closeOnClick  : true,
    constrainWidth: false,
  });

  M.Tooltip.init($('.tooltipped'), { position: 'top', enterDelay: 4e3 });

  table.page.len(5).draw();

  M.FormSelect.init($('select'));
  M.Sidenav.init($('.sidenav'));
});