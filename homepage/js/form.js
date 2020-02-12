(function( $ ) {
    $.fn.autoKana( '#name_1', '#read_1', {
        katakana: false
    });
    $.fn.autoKana( '#name_2', '#read_2', {
        katakana: false
    });
})( jQuery );

var mailform_dt    = $( 'form#mail_form dl dt' );
$(document).ready(
    function() {
        for ( var i = 0; i < mailform_dt.length; i++ ) {
            if ( mailform_dt.eq(i).next( 'dd' ).hasClass( 'required' ) ) {
                $( '<span/>' )
                .text( '必須' )
                .addClass( 'required' )
                .prependTo( $( mailform_dt.eq(i) ) );
            } else {
                $( '<span/>' )
                .text( '任意' )
                .addClass( 'optional' )
                .prependTo( $( mailform_dt.eq(i) ) );
            }

            $( '<span/>' )
            .addClass( 'error_blank' )
            .appendTo( mailform_dt.eq(i).next( 'dd' ) );

            if ( mailform_dt.eq(i).next( 'dd' ).find( 'input' ).length && mailform_dt.eq(i).next( 'dd' ).find( 'input' ).eq(0).attr( 'type' ) === 'email' ) {
                $( '<span/>' )
                .addClass( 'error_format' )
                .appendTo( mailform_dt.eq(i).next( 'dd' ) );
            }
        }
    }
);

document.getElementById("form_submit_button").onclick = function() {
    required_check();
};

function slice_method( el ) {
    var dt      = el.parents( 'dd' ).prev( 'dt' );
    var dt_name = dt.html().replace( /<span>.*<\/span>/gi, '' );
    dt_name     = dt_name.replace( /^<span\s.*<\/span>/gi, '' );
    dt_name     = dt_name.replace( /<br>|<br \/>/gi, '' );
    return dt_name;
}

function error_span( e, dt, comment, bool ) {
    if ( bool === true ) {
        var m = e.parents( 'dd' ).find( 'span.error_blank' ).text( dt + 'が' + comment + 'されていません' );
    } else {
        var m = e.parents( 'dd' ).find( 'span.error_blank' ).text( '' );
    }
}

function compare_method( s, e ) {
    if ( s > e ) {
        return e;
    } else {
        return s;
    }
}

function required_check() {
    var error        = 0;
    var scroll_point = $( 'body' ).height();
    for ( var i = 0; i < mailform_dt.length; i++ ) {

        // required input
        if ( mailform_dt.eq(i).next( 'dd' ).find( 'input' ).length && mailform_dt.eq(i).next( 'dd' ).hasClass( 'required' ) ) {
            var elements = mailform_dt.eq(i).next( 'dd' ).find( 'input' );
            var dt_name  = slice_method( elements.eq(0) );
            if ( elements.eq(0).attr( 'type' ) === 'radio' || elements.eq(0).attr( 'type' ) === 'checkbox' ) {
                var list_error = 0;
                for ( var j = 0; j < elements.length; j++ ) {
                    if ( elements.eq(j).prop( 'checked' ) === false ) {
                        list_error++;
                    }
                }
                if ( list_error === elements.length ) {
                    error_span( elements.eq(0), dt_name, '選択', true );
                    error++;
                    scroll_point = compare_method( scroll_point, elements.eq(0).offset().top );
                } else {
                    error_span( elements.eq(0), dt_name, '', false );
                }
            } else {
                var list_error = 0;
                for ( var j = 0; j < elements.length; j++ ) {
                    if ( elements.eq(j).val() === '' ) {
                        list_error++;
                    }
                }
                if ( list_error !== 0 ) {
                    error_span( elements.eq(0), dt_name, '入力', true );
                    error++;
                    scroll_point = compare_method( scroll_point, elements.eq(0).offset().top );
                } else {
                    error_span( elements.eq(0), dt_name, '', false );
                }

            }
        }

        // required textarea
        if ( mailform_dt.eq(i).next( 'dd' ).find( 'textarea' ).length && mailform_dt.eq(i).next( 'dd' ).hasClass( 'required' ) ) {
            var elements = mailform_dt.eq(i).next( 'dd' ).find( 'textarea' );
            var dt_name  = slice_method( elements.eq(0) );
            if ( elements.eq(0).val() === '' ) {
                error_span( elements.eq(0), dt_name, '入力', true );
                error++;
                scroll_point = compare_method( scroll_point, elements.eq(0).offset().top );
            } else {
                error_span( elements.eq(0), dt_name, '', false );
            }
        }

        // no-required email
        if ( mailform_dt.eq(i).next( 'dd' ).find( 'input' ).length && mailform_dt.eq(i).next( 'dd' ).find( 'input' ).eq(0).attr( 'type' ) === 'email' ) {
            var elements = mailform_dt.eq(i).next( 'dd' ).find( 'input' );
            var dt_name  = slice_method( elements.eq(0) );
            if( elements.eq(0).val() !== '' && ! ( elements.eq(0).val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) ) ) {
                elements.eq(0).parents( 'dd' ).find( 'span.error_format' ).text( '正しいメールアドレスの書式ではありません。' );
                error++;
                scroll_point = compare_method( scroll_point, elements.eq(0).offset().top );
            } else {
                elements.eq(0).parents( 'dd' ).find( 'span.error_format' ).text( '' );
            }

            if ( $( 'input#mail_address_confirm' ).length && $( 'input#mail_address' ).length ) {
                var element   = $( 'input#mail_address_confirm' );
                var element_2 = $( 'input#mail_address' );
                var dt_name   = slice_method( element );
                console.log("element:"+element.val());
                console.log("element:"+element_2.val())
                if ( element.val() !== '' && element.val() !== element_2.val() ) {
                    console.log("true");
                    element.parents( 'dd' ).find( 'span.error_format' ).text( 'メールアドレスが一致しません。' );
                    error++;
                    scroll_point = compare_method( scroll_point, element.offset().top );
                } else {
                    element.parents( 'dd' ).find( 'span.error_format' ).text( '' );
                }
            }

        }
    }
    if ( error === 0 ) {
        var confirm_window = 1;
        if ( confirm_window === 1 ) {
            if ( window.confirm( '送信してもよろしいですか？' ) ) {
                // send_setup();
                // order_set();
                // send_method();
                // dummy
                setTimeout(function(){window.confirm( '送信しました。' )}, 500);
            }
        }
    } else {
        $( 'html, body' ).animate({
            scrollTop: scroll_point - 70
        }, 500 );
    }

}
