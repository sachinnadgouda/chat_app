def is_prime(number)
	return "#{number} is prime" if number < 3
	range_number = number -1
	is_prime = true
	(2..range_number).each do |n|
		if number % n == 0 
			is_prime = false
			break
		end
	end
	return "#{number} is prime" if is_prime
end

def is_prime?(num)
   Math.sqrt(num).floor.downto(2).each {|i| return false if num % i == 0}
   puts "#{num} is prime"
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
	(3..100).each do |n|
		puts is_prime(n)
		is_prime?(n)
	end
end

check_prime
#print_fizzbuzz(15)
#get_fibonacci(10)
print_x(10)

