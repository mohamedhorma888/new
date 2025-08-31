        function bubbleSort(arra) {
            let n = arra.length;
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - 1 - i; j++) {
                    if (arra[j] > arra[j + 1]) {
                        let temp = arra[j];
                        arra[j] = arra[j + 1];
                        arra[j + 1] = temp;
                    }
                }
            }
            return arra;
        }

        