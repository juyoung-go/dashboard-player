module.exports = {
  home:'https://app.datadoghq.com/account/login',
  target:'https://app.datadoghq.com/dashboard/6j2-bmv-ijq/rsquare-sample-dashboard?from_ts=1656647349551&to_ts=1656647649551&live=true',
  init:[

    //id
    {
      code:"`document.getElementById('username') && (document.getElementById('username').value='${id}');`",
    },
    //pass
    {
      code:"`document.getElementById('password') && (document.getElementById('password').value='${pass}');`",
      timeAfter:1000,
    },
    //login
    {
      code:'document.querySelector(`button.druids_form_button`) && document.querySelector(`button.druids_form_button`).click();',
    }

  ],
  play:[

    //timeAfter
    {
      code:'console.log("play")'
    },
    //eventAfter
    // {
    //   code:'document.querySelectorAll("a.druids_table_table__cell-content")[0].click()',
    //   eventAfter:'did-finish-load',
    // },

  ]
}