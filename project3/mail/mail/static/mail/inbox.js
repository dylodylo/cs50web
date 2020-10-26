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

function compose_email(recipients, subject, body, date) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emails-table').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#archive-button').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#archive-button').style.display = 'none';
  document.querySelector("#response").style.display = 'none';

  // Clear out composition fields
  if (typeof recipients === "string")
  {
    document.querySelector('#compose-recipients').value = recipients;
    console.log(subject.slice(0,3))
    if (subject.slice(0,3) === "Re:")
    {
      document.querySelector('#compose-subject').value = subject;
    }
    else {
      document.querySelector('#compose-subject').value = "Re: " + subject;
    }
    
    document.querySelector('#compose-body').value = `On ${date} ${recipients} wrote: ${body}`;
  }
  else {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emails-table').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#archive-button').style.display = 'none';
  document.querySelector("#response").style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    
  const table = document.getElementById('emails-table');
  table.innerHTML = ''
  emails.forEach(item => show_mail_table(item, table));
  const rows = document.querySelectorAll("tr[data-email-id]");
  console.log(rows);
  rows.forEach(row => {
    row.addEventListener("click", () => {
      id = row.dataset.emailId
      console.log(id)
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })      
      document.querySelector("#emails-view").style.display = 'none';
      document.querySelector('#emails-table').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'block';
      document.querySelector('#archive-button').style.display = 'none';
      document.querySelector("#response").style.display = 'none';
  
      fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(email => {
      // Print email
      console.log(email);
      document.querySelector('#email-view').innerHTML = `<h3> ${email.subject} </h3> <h5> From: ${email.sender} </h5> <h6> Date: ${email.timestamp} </h6><br/> <p> ${email.body} </p>`
      button = document.querySelector('#archive-button')
      button.style.display = 'block';
      if (row.archived === false)
      {
        button.innerHTML = 'Archive mail';
      }
      else{
        button.innerHTML = 'Move to inbox';
      }
      response_button = document.querySelector("#response")
      response_button.style.display = 'block'
      response_button.onclick = (() => compose_email(email.sender, email.subject, email.body, email.timestamp))
      archived = email.archived
      button.onclick = (() => {
        if (archived === false)
      {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        })      
      }
      else{
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
          })
        })      
      }
      load_mailbox('inbox')
      })
      

    })
  })
});   
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

    function show_mail_table(mail, table){
      sender = mail.sender;
      subject = mail.subject;
      content = mail.body;
      date = mail.timestamp;
      const row = table.insertRow()
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      cell1.innerHTML = sender;
      cell2.innerHTML = subject;
      cell3.innerHTML = date;
      row.dataset.emailId = mail.id;
      if (mail.read === false)
      {
        row.style.backgroundColor = 'grey';
      }
    }
      
    // ... do something else with emails ...
  });
  
}