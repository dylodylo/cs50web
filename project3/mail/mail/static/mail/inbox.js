document.addEventListener('DOMContentLoaded', function(event) {

  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = () => {
      
      const recipients = document.querySelector('#compose-recipients').value;
      const subject = document.querySelector('#compose-subject').value;
      const body = document.querySelector('#compose-body').value;

      console.log(recipients,subject,body);

      fetch('/emails', {
        method:'POST',
        body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body,
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        load_mailbox('sent')
      })
      return false;
  };

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(event) {
  event.preventDefault();
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    
    
    emails.forEach(show_mail_table);
      
  function show_mail(mail){
      const post = document.createElement('div');
      post.className = 'posts';
      sender = mail.sender;
      subject = mail.subject;
      content = mail.body;
      date = mail.timestamp;
      post.innerHTML = sender+subject+content+date;
      console.log(mail);
      document.querySelector("#emails-view").append(post);
      
    };

    function show_mail_table(mail){
      sender = mail.sender;
      subject = mail.subject;
      content = mail.body;
      date = mail.timestamp;
      var table = document.getElementById('emails-table');
      var row = table.insertRow()
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = sender;
      cell2.innerHTML = subject;
      cell3.innerHTML = date;
      if (mail.read === false)
      {
        row.style.backgroundColor = 'grey';
      }
    }
    // ... do something else with emails ...
  });

}