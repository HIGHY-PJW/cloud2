package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173") // Vite 기본 포트 허용
public class TodoController {
    private final List<Todo> todos = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public TodoController() {
        // 초기 데이터
        todos.add(new Todo(counter.incrementAndGet(), "Spring Boot 백엔드 설정하기", false));
        todos.add(new Todo(counter.incrementAndGet(), "React 프론트엔드 개발하기", false));
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todos;
    }

    @PostMapping
    public Todo addTodo(@RequestBody Todo todo) {
        todo.setId(counter.incrementAndGet());
        todos.add(todo);
        return todo;
    }

    @PutMapping("/{id}")
    public Todo toggleTodo(@PathVariable Long id) {
        for (Todo todo : todos) {
            if (todo.getId().equals(id)) {
                todo.setCompleted(!todo.isCompleted());
                return todo;
            }
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todos.removeIf(todo -> todo.getId().equals(id));
    }
}
