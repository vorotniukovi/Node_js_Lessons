const toCurrency = price =>{
    return new Intl.NumberFormat('ru-RU',{
        currency: 'rub',
        style: 'currency'
    }).format(price)
}
document.querySelectorAll('.price').forEach(node =>{
    node.textContent = toCurrency(node.textContent)
})
const $card = document.querySelector('#card')
if($card){
    $card.addEventListener('click',event =>{
        if(event.target.classList.contains('js-remove')){
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf


            fetch('/card/remove/' + id, {
                method: 'delete',
                headers:{
                    'X-CSRF-TOKEN': csrf
                }
            }).then(res=>res.json())
                .then(card => {
                    //console.log(card)
               if(card.courses.length){
                    const html = card.courses.map(c => {
                        return `
                        <tr>
                            <td>${c.title}</td>
                            <td>${c.count}</td>
                            <td>
                                <button class="btn btn-primary js-remove" data-id="${c.id}" data-csrf="${csrf}">Удалить</button>
                            </td>
                        </tr>
                        `
                    }).join('')
                   $card.querySelector('tbody').innerHTML = html
                   $card.querySelector('.price').textContent = toCurrency(card.price)
               }else{
                   $card.innerHTML = "<p>Корзина пуста</p>"
               }
            })
        }
    })
}
var instance = M.Tabs.init(document.querySelectorAll('.tabs'));