// inputMask
let inputs = document.querySelectorAll('input[type="tel"]');
let im = new Inputmask('+7 (999) 999-99-99');
im.mask(inputs);

// const form = document.querySelector('#tg');

// console.log(form);


// function validateForms(selector, rules) {
    
//     new window.JustValidate(selector, {
//         rules: rules,
//         submitHandler: function (form, values, ajax) {
//             console.log(form);
            
//         }
//     });
// }

// validateForms('.order', 
// { 
//     fio: { required: true }, 
//     phone: { required: true } 
// });