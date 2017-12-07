def is_prime(number)
	range_number = number -1
	is_prime = true
	(2..range_number).each do |n|
		if number % n == 0 
			puts "#{number} is not prime"
			is_prime = false
			break
		end
	end
	puts "#{number} is prime" if is_prime
end

def print_fizzbuzz(number)
	(1..number).each do |n|
		if n % 15 == 0 
			puts "fizzbuzz"
		elsif n % 5 == 0
			puts "fizz"
		elsif n % 3 == 0
			puts "buzz"
		else
		    puts n	
		end
	end
end

def get_fibonacci(number)
    fibonacci = [0,1]
    length = fibonacci.length
    until length > number do
       fibonacci << (fibonacci[length-2] + fibonacci[length-1])
       length = fibonacci.length
    end
    puts  fibonacci
end

def print_x(number)
    (1..number).each do |n|
     	puts  "x" * n 
    end
end

def check_prime
	(3..10).each do |n|
		is_prime(n)
	end
end

#check_prime
#print_fizzbuzz(15)
#get_fibonacci(10)
print_x(10)

