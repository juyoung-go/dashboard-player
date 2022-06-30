module.exports = {
  home:'https://app.datadoghq.com/account/login',
  target:'https://app.datadoghq.com/apm/services/migo-admin-api/operations/servlet.request/resources?env=prd&resources=qson%3A%28data%3A%28visible%3A%21t%2Chits%3A%28selected%3Atotal%29%2Cerrors%3A%28selected%3Atotal%29%2Clatency%3A%28selected%3Ap99%29%2CtopN%3A%215%29%2Cversion%3A%210%29&summary=qson%3A%28data%3A%28visible%3A%21t%2Cerrors%3A%28selected%3Acount%29%2Chits%3A%28selected%3Acount%29%2Clatency%3A%28selected%3Alatency%2Cslot%3A%28agg%3A75%29%2Cdistribution%3A%28isLogScale%3A%21f%29%29%2Csublayer%3A%28slot%3A%28layers%3Aservice%29%2Cselected%3Apercentage%29%29%2Cversion%3A%211%29&start=1656485112427&end=1656488712427&paused=false',
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