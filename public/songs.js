document.addEventListener('DOMContentLoaded', () => {
  const logoff = document.getElementById('logoff');
  const message = document.getElementById('message');
  const logonRegister = document.getElementById('logon-register');
  const logon = document.getElementById('logon');
  const register = document.getElementById('register');
  const logonDiv = document.getElementById('logon-div');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const logonButton = document.getElementById('logon-button');
  const logonCancel = document.getElementById('logon-cancel');
  const registerDiv = document.getElementById('register-div');
  const name = document.getElementById('name');
  const email1 = document.getElementById('email1');
  const password1 = document.getElementById('password1');
  const password2 = document.getElementById('password2');
  const registerButton = document.getElementById('register-button');
  const registerCancel = document.getElementById('register-cancel');
  const songs = document.getElementById('songs');
  const songsTable = document.getElementById('songs-table');
  const songsTableHeader = document.getElementById('songs-table-header');
  const addSong = document.getElementById('add-song');
  const editSong = document.getElementById('edit-song');
  const title = document.getElementById('title');
  const artist = document.getElementById('artist');
  const mood = document.getElementById('mood');
  const addingSong = document.getElementById('adding-song');
  const songsMessage = document.getElementById('songs-message');
  const editCancel = document.getElementById('edit-cancel');

  async function buildSongsTable(songsTable, songsTableHeader, token, message) {
    try {
      const response = await fetch('/api/v1/songs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const children = [songsTableHeader];
      if (response.status === 200) {
        if (data.count === 0) {
          songsTable.replaceChildren(...children);
          return 0;
        } else {
          for (let i = 0; i < data.songs.length; i++) {
            let editButton = `<td><button type="button" class="editButton" data-id=${data.songs[i]._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.songs[i]._id}>delete</button></td>`;
            let rowHTML = `<td>${data.songs[i].title}</td><td>${data.songs[i].artist}</td><td>${data.songs[i].mood}</td>${editButton}${deleteButton}`;
            let rowEntry = document.createElement('tr');
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }
          songsTable.replaceChildren(...children);
        }
        return data.count;
      } else {
        message.textContent = data.error;
        return 0;
      }
    } catch (error) {
      message.textContent = 'A communication error occurred.';
      return 0;
    }
  }

  //section2
  let showing = logonRegister;
  let token = null;

  document.addEventListener('startDisplay', async () => {
    showing = logonRegister;
    token = localStorage.getItem('token');
    if (token) {
      //if the user is logged in
      logoff.style.display = 'block';
      const count = await buildSongsTable(
        songsTable,
        songsTableHeader,
        token,
        message
      );
      if (count > 0) {
        songsMessage.textContent = '';
        songsTable.style.display = 'block';
      } else {
        songsMessage.textContent = 'There are no songs to display';
        songsTable.style.display = 'none';
      }
      songs.style.display = 'block';
      showing = songs;
    } else {
      logonRegister.style.display = 'block';
    }
  });
  //section3
  let thisEvent = new Event('startDisplay');
  document.dispatchEvent(thisEvent);
  let suspendInput = false;

  document.addEventListener('click', async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === 'BUTTON') {
      message.textContent = '';
    }
    if (e.target === logoff) {
      localStorage.removeItem('token');
      token = null;
      showing.style.display = 'none';
      logonRegister.style.display = 'block';
      showing = logonRegister;
      songsTable.replaceChildren(songsTableHeader); // don't want other users to see
      message.textContent = 'You are logged off.';
    } else if (e.target === logon) {
      showing.style.display = 'none';
      logonDiv.style.display = 'block';
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = 'none';
      registerDiv.style.display = 'block';
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = 'none';
      logonRegister.style.display = 'block';
      showing = logonRegister;
      email.value = '';
      password.value = '';
      name.value = '';
      email1.value = '';
      password1.value = '';
      password2.value = '';
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem('token', token);
          showing.style.display = 'none';
          thisEvent = new Event('startDisplay');
          email.value = '';
          password.value = '';
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        // console.log(response)
        message.textContent = 'A communications error occurred.';
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value !== password2.value) {
        message.textContent = 'The passwords entered do not match.';
      } else {
        suspendInput = true;
        try {
          const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();

          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome, ${data.user.name}!`;
            token = data.token;
            localStorage.setItem('token', token);
            showing.style.display = 'none';
            thisEvent = new Event('startDisplay');
            document.dispatchEvent(thisEvent);
            name.value = '';
            email1.value = '';
            password1.value = '';
            password2.value = '';
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          // console.log(response)
          message.textContent = 'A communications error occurred.';
        }
        suspendInput = false;
      }
    } else if (e.target === addSong) {
      showing.style.display = 'none';
      editSong.style.display = 'block';
      showing = editSong;
      delete editSong.dataset.id;
      title.value = '';
      artist.value = '';
      mood.value = 'happy';
      addingSong.textContent = 'add';
    } else if (e.target === editCancel) {
      showing.style.display = 'none';
      title.value = '';
      artist.value = '';
      mood.value = 'happy';
      thisEvent = new Event('startDisplay');
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingSong) {
      if (!editSong.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch('/api/v1/songs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              artist: artist.value,
              mood: mood.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = 'The song was created.';
            showing.style.display = 'none';
            thisEvent = new Event('startDisplay');
            document.dispatchEvent(thisEvent);
            title.value = '';
            artist.value = '';
            mood.value = 'happy';
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = 'A communication error occurred.';
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const songID = editSong.dataset.id;
          const response = await fetch(`/api/v1/songs/${songID}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              artist: artist.value,
              mood: mood.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = 'The song was updated.';
            showing.style.display = 'none';
            title.value = '';
            artist.value = '';
            mood.value = 'pending';
            thisEvent = new Event('startDisplay');
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = 'A communication error occurred.';
        }
      }
      suspendInput = false;
    } else if (e.target.classList.contains('editButton')) {
      editSong.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/songs/${e.target.dataset.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          title.value = data.song.title;
          artist.value = data.song.artist;
          mood.value = data.song.mood;
          showing.style.display = 'none';
          showing = editSong;
          showing.style.display = 'block';
          addingSong.textContent = 'update';
          message.textContent = '';
        } else {
          // might happen if the list has been updated since last display
          message.textContent = 'The song was not found';
          thisEvent = new Event('startDisplay');
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = 'A communications error has occurred.';
      }
      suspendInput = false;
    } else if (e.target.classList.contains('deleteButton')) {
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/songs/${e.target.dataset.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = 'The song was successfully deleted.';
          thisEvent = new Event('startDisplay');
          document.dispatchEvent(thisEvent);
        }
      } catch (error) {
        message.textContent = 'A communications error has occurred.';
      }
      suspendInput = false;
    }
  });
});
