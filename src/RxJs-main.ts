import {fromEvent, Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, map, takeUntil} from "rxjs/operators";

/*
const search$ = new Observable<Event>(observer => {
	console.log("Start in observable");
	// observer.next(1);
	// observer.next(2);
	// observer.next(3);

	const search = document.getElementById('search');
	const stop = document.getElementById('stop');

	if (!search || !stop) {
		observer.error('Element not exists on the page');
		return;
	}

	const onSearch = (event: Event | undefined) => {
		console.log(123);
		checkSubscription();
		observer.next(event);

	};

	const onStop = (event: any) => {
		checkSubscription();
		// отписка
		observer.complete();
		clear();
	}

	// подписка на событие
	search.addEventListener('input', onSearch);
	stop.addEventListener('click', onStop);

	const checkSubscription = () => {
		if(observer.closed){
			clear();
		}
	}


	const clear = () => {
		// отписка от прослушивания события
		search.removeEventListener('input', onSearch);
		stop.removeEventListener('click', onStop);
	}
});
*/

// Заменяет закомментированный блок сверху
const search$: Observable<Event> = fromEvent<Event>(
	(document.getElementById("search") as HTMLElement),
	'input');

const stop$: Observable<Event> = fromEvent<Event>(
	(document.getElementById("stop") as HTMLElement),
	'click');

search$.pipe(
	// переработка получаемого значение в событии
	map(event => {
		return (event.target as HTMLInputElement).value;
	}),
	// задержка перед срабатыванием
	debounceTime(500),
	// не получает событие если предыдущее значение такое же как и следующее
	distinctUntilChanged(),
	// работать до тех пор пока не сработает stop$
	takeUntil(stop$)
).subscribe(
		{
			next: value => {
				console.log(value);
			},
			error: err => {
				console.log(err);
			},
			complete: () => {
				console.log("complete");
			}
		});

/*
// был необходим до добавления takeUntil(stop$)
const stopSubscription = stop$.subscribe(() => {
	searchSubscription.unsubscribe();
	stopSubscription.unsubscribe();
})
*/

/*
setTimeout(() => {
	console.log('unsubscribed');
	searchSubscription.unsubscribe();
}, 10000);
*/
