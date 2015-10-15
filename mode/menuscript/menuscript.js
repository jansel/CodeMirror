CodeMirror.defineMode("menuscript", function(config, parserConfig) {

  return {
    startState: function(basecolumn) {
      return {
        last : 'unknown',
        next_guess : 'name'
      };
    },

    token: function(stream, state) {

      if (stream.match(/^[ \t\n\r\u2013]*$/, true)) {
        state.next_guess = 'name';
        state.last = 'blank';
        return state.last;
      }

      if (stream.match(/^[ \t]*[?](.*)$/, true)) {
        state.next_guess = 'name';
        state.last = 'unknown';
        return state.last;
      }

      if (stream.match(/^[ \t]*[#](.*)$/, true)) {
        state.next_guess = 'name';
        state.last = 'junk';
        return state.last;
      }

      if (stream.match(/^[ \t]*\^(.*)$/, true)) {
        return 'features';
      }

      if (stream.match(/^[ \t]*[%](.*)$/, true)) {
        state.next_guess = 'name';
        state.last = 'sectiontext';
        return state.last;
      }

      if (stream.match(/^[ \t]*===[ ]*(.*?)[= ]*$/, true)) {
        state.next_guess = 'name';
        state.last = 'subsection';
        return state.last;
      }

      if (stream.match(/^[ \t]*==[ ]*(.*?)[= ]*$/, true)) {
        state.next_guess = 'name';
        state.last = 'section';
        return state.last;
      }

      if (stream.match(/^[ \t]*=[ ]*(.*?)[= ]*$/, true)) {
        state.next_guess = 'name';
        state.last = 'menu';
        return state.last;
      }

      if (stream.match(/^[ \t]*-name:(.*)$/, true)) {
        state.next_guess = 'desc';
        state.last = 'name';
        return state.last;
      }

      if (stream.match(/^[ \t]*-price:(.*)$/, true)) {
        state.next_guess = 'desc';
        state.last = 'price';
        return state.last;
      }

      if (stream.match(/^[ \t]*-desc:(.*)$/, true)) {
        state.next_guess = 'desc';
        state.last = 'desc';
        return state.last;
      }

      if (stream.match(/^[ \t-]*photo:[ \t]?.*$/, true)) {
        state.next_guess = 'desc';
        state.last = 'photo';
        return state.last;
      }

      if (stream.match(/^[ \t-]*(choose:.*)$/, true)) {
        state.next_guess = 'option';
        state.last = 'choose';
        return state.last;
      }

      if (stream.match(/^[ \t-]*(add:.*)$/, true)) {
        state.next_guess = 'option';
        state.last = 'add';
        return state.last;
      }

      if (stream.match(/^[ \t]*[ \t\r$0-9.+\–\—\-]+([Pp]er[ ].+|[Ee]ach|[Aa]nd[ \t]+[Uu]p)?[ \t\r]*$/, true)
          || stream.match(/^[ \t]*([Mm]arket|[Mm]kt|[Mm][Pp]|[Ss]easonal|[Nn][/]?[Aa]|[Cc]onsultation|[Bb]y[ \t]+[Cc]onsultation)[ \t\r]*$/, true)) {
        if(state.last == 'blank') {
          state.next_guess = 'desc';
          state.last = 'name';
        }else if(state.next_guess == 'option') {
          state.last = 'option';
        }else{
          state.last = 'price';
        }
        return state.last;
      }

      if (stream.match(/^(.*)$/, true)) {
        state.last = state.next_guess;
        if(state.next_guess == 'name') {
          state.next_guess = 'desc';
        }
        return state.last;
      }

      stream.skipToEnd();
      state.last = "error";
      return state.last;
    },

    indent: function(state, textAfter) {
      if (state.next_guess == 'option') {
        return 2;
      }
      return 0;
    },

    blankLine: function(state) {
      state.next_guess = 'name';
      state.last = 'blank';
    }
  };
});

CodeMirror.defineMIME("text/menuscript", "menuscript");
