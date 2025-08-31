        function selectionSort(arra) {
            let n = arra.length;
            for (let i = 0; i < n - 1; i++) {
                let minIdx = i;
                for (let j = i + 1; j < n; j++) {
                    if (arra[j] < arra[minIdx]) {
                        minIdx = j;
                    }
                }
                if (minIdx !== i) {
                    let temp = arra[i];
                    arra[i] = arra[minIdx];
                    arra[minIdx] = temp;
                }
            }
            return arra;
        }

        let Array1 = [70, 30, 12, 20, 11];
        console.log("Unsorted array:", Array1);
        let sortedArray1 = selectionSort(Array1);
        console.log("Sorted array :",sortedArray1 ); // [11, 12, 20, 30, 70]